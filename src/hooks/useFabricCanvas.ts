import { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';

export const useFabricCanvas = (canvasId: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('Canvas ref not available');
      return;
    }

    console.log('Initializing Fabric.js canvas...');
    
    // Clean up any existing canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }

    const canvasElement = canvasRef.current;
    
    try {
      // Initialize Fabric.js canvas
      const fabricCanvas = new fabric.Canvas(canvasElement, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
      });

      console.log('Fabric.js canvas created successfully');

      // Set default selection styles
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = '#2563eb';
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.cornerSize = 8;
      fabric.Object.prototype.borderColor = '#2563eb';

      fabricCanvasRef.current = fabricCanvas;
      setCanvas(fabricCanvas);
      setIsReady(true);
      
      console.log('Canvas ready:', true);
    } catch (error) {
      console.error('Error initializing Fabric.js canvas:', error);
    }

    return () => {
      console.log('Cleaning up canvas...');
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (error) {
          console.error('Error disposing canvas:', error);
        }
        fabricCanvasRef.current = null;
      }
      setCanvas(null);
      setIsReady(false);
    };
  }, []);

  // Add rectangle
  const addRectangle = () => {
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  // Add circle
  const addCircle = () => {
    if (!canvas) return;

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#10b981',
      stroke: '#047857',
      strokeWidth: 2,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  // Add text
  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText('Click to edit text', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#1f2937',
      fontFamily: 'Arial, sans-serif',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // Enable drawing mode
  const enableDrawing = (enabled: boolean) => {
    if (!canvas) return;

    canvas.isDrawingMode = enabled;
    
    if (enabled) {
      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = '#ef4444';
    }
  };

  // Delete selected object
  const deleteSelected = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  // Get canvas state as JSON
  const getCanvasState = () => {
    if (!canvas) return '{}';
    return JSON.stringify(canvas.toJSON());
  };

  // Load canvas state from JSON
  const loadCanvasState = (state: string) => {
    if (!canvas) return;

    try {
      const parsedState = JSON.parse(state);
      canvas.loadFromJSON(parsedState, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error('Error loading canvas state:', error);
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  };

  return {
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
    clearCanvas,
  };
};