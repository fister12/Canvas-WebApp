import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fabric } from 'fabric';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { canvasService } from '../services/canvasService';
import Toolbar from '../components/Toolbar';
import PropertyPanel from '../components/PropertyPanel';
import FirebaseDebugger from '../components/FirebaseDebugger';
import { ArrowLeft, Loader2 } from 'lucide-react';
import './CanvasEditor.css';

const CanvasEditor: React.FC = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const navigate = useNavigate();
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [canvasName, setCanvasName] = useState('Untitled Canvas');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    canvasRef,
    canvas,
    isReady,
    addRectangle,
    addCircle,
    addText,
    enableDrawing,
    deleteSelected,
    getCanvasState,
    loadCanvasState,
  } = useFabricCanvas(canvasId || '');

  // Load canvas data from Firestore (only once when component mounts and canvas is ready)
  useEffect(() => {
    let hasLoaded = false;
    
    const loadCanvas = async () => {
      if (!canvasId || !isReady || hasLoaded) {
        return;
      }

      hasLoaded = true;
      setIsLoading(true);
      
      try {
        console.log('Loading canvas data from Firestore...');
        const canvasData = await canvasService.getCanvas(canvasId);
        if (canvasData) {
          console.log('Canvas data loaded:', canvasData);
          setCanvasName(canvasData.name);
          if (canvasData.canvasState && canvasData.canvasState !== '{}') {
            loadCanvasState(canvasData.canvasState);
          }
        } else {
          console.warn('Canvas not found in Firestore');
        }
      } catch (error) {
        console.error('Error loading canvas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isReady && canvasId) {
      loadCanvas();
    }
  }, [canvasId, isReady]); // Removed loadCanvasState from dependencies

  // Set up canvas event listeners
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e: any) => {
      setSelectedObject(e.target);
    };

    const handleSelectionCleared = () => {
      setSelectedObject(null);
    };

    const handleCanvasModified = () => {
      setHasUnsavedChanges(true);
      console.log('Canvas modified - changes detected');
    };

    // Listen for canvas changes
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:added', handleCanvasModified);
    canvas.on('object:removed', handleCanvasModified);
    canvas.on('object:modified', handleCanvasModified);
    canvas.on('path:created', handleCanvasModified); // For drawing

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:added', handleCanvasModified);
      canvas.off('object:removed', handleCanvasModified);
      canvas.off('object:modified', handleCanvasModified);
      canvas.off('path:created', handleCanvasModified);
    };
  }, [canvas]);

  const handleToggleDrawing = (enabled: boolean) => {
    setIsDrawingMode(enabled);
    enableDrawing(enabled);
  };

  const handleSave = useCallback(async (force = false) => {
    if (!canvasId || isSaving || (!hasUnsavedChanges && !force)) {
      console.log('Save skipped - no changes or already saving');
      return;
    }

    setIsSaving(true);
    try {
      const state = getCanvasState();
      await canvasService.saveCanvas(canvasId, state, canvasName);
      console.log('Canvas saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('Failed to save canvas. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [canvasId, isSaving, hasUnsavedChanges, getCanvasState, canvasName]);

  // Auto-save with debounce when changes are detected
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save after 3 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      console.log('Auto-saving canvas...');
      handleSave();
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, handleSave]);

  const handleManualSave = () => {
    handleSave(true); // Force save even if no changes detected
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!canvasId) {
    return (
      <div className="canvas-editor error">
        <h1>Invalid Canvas ID</h1>
        <button onClick={handleGoHome}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="canvas-editor">
      <FirebaseDebugger />
      <div className="canvas-header">
        <button className="back-button" onClick={handleGoHome}>
          <ArrowLeft size={18} />
          Back to Home
        </button>
        <h1 className="canvas-title">
          {canvasName}
          {hasUnsavedChanges && <span className="unsaved-indicator"> •</span>}
        </h1>
        <div className="canvas-id">ID: {canvasId}</div>
      </div>

      <div className="canvas-workspace">
        <Toolbar
          onAddRectangle={addRectangle}
          onAddCircle={addCircle}
          onAddText={addText}
          onToggleDrawing={handleToggleDrawing}
          onDeleteSelected={deleteSelected}
          onSave={handleManualSave}
          isDrawingMode={isDrawingMode}
          isSaving={isSaving}
        />

        <div className="canvas-container">
          {isLoading && (
            <div className="canvas-loading">
              <Loader2 className="spinning" size={32} />
              <p>Loading canvas...</p>
            </div>
          )}
          <div className="canvas-wrapper">
            <canvas 
              ref={canvasRef} 
              id={`fabric-canvas-${canvasId}`}
              className={isLoading ? 'loading' : ''} 
            />
          </div>
        </div>

        <PropertyPanel canvas={canvas} selectedObject={selectedObject} />
      </div>
    </div>
  );
};

export default CanvasEditor;