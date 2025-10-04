import React from 'react';
import { 
  Square, 
  Circle, 
  Type, 
  Pen, 
  Trash2, 
  Save,
  MousePointer
} from 'lucide-react';
import './Toolbar.css';

interface ToolbarProps {
  onAddRectangle: () => void;
  onAddCircle: () => void;
  onAddText: () => void;
  onToggleDrawing: (enabled: boolean) => void;
  onDeleteSelected: () => void;
  onSave: () => void;
  isDrawingMode: boolean;
  isSaving: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddRectangle,
  onAddCircle,
  onAddText,
  onToggleDrawing,
  onDeleteSelected,
  onSave,
  isDrawingMode,
  isSaving,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Tools</h3>
        <div className="tool-group">
          <button 
            className={`tool-button ${!isDrawingMode ? 'active' : ''}`}
            onClick={() => onToggleDrawing(false)}
            title="Select Tool"
          >
            <MousePointer size={18} />
            Select
          </button>
          <button 
            className={`tool-button ${isDrawingMode ? 'active' : ''}`}
            onClick={() => onToggleDrawing(true)}
            title="Pen Tool"
          >
            <Pen size={18} />
            Draw
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Shapes</h3>
        <div className="tool-group">
          <button 
            className="tool-button"
            onClick={onAddRectangle}
            title="Add Rectangle"
          >
            <Square size={18} />
            Rectangle
          </button>
          <button 
            className="tool-button"
            onClick={onAddCircle}
            title="Add Circle"
          >
            <Circle size={18} />
            Circle
          </button>
          <button 
            className="tool-button"
            onClick={onAddText}
            title="Add Text"
          >
            <Type size={18} />
            Text
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Actions</h3>
        <div className="tool-group">
          <button 
            className="tool-button delete-button"
            onClick={onDeleteSelected}
            title="Delete Selected"
          >
            <Trash2 size={18} />
            Delete
          </button>
          <button 
            className={`tool-button save-button ${isSaving ? 'saving' : ''}`}
            onClick={onSave}
            disabled={isSaving}
            title="Save Canvas"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;