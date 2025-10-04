import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './PropertyPanel.css';

interface PropertyPanelProps {
  canvas: fabric.Canvas | null;
  selectedObject: fabric.Object | null;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ canvas, selectedObject }) => {
  const [fill, setFill] = useState('#3b82f6');
  const [stroke, setStroke] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [text, setText] = useState('');

  useEffect(() => {
    if (selectedObject) {
      setFill((selectedObject.fill as string) || '#3b82f6');
      setStroke((selectedObject.stroke as string) || '#1e40af');
      setStrokeWidth(selectedObject.strokeWidth || 2);
      
      if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
        const textObject = selectedObject as fabric.IText;
        setFontSize(textObject.fontSize || 20);
        setFontFamily(textObject.fontFamily || 'Arial');
        setText(textObject.text || '');
      }
    }
  }, [selectedObject]);

  const updateProperty = (property: string, value: any) => {
    if (!selectedObject || !canvas) return;

    (selectedObject as any).set(property, value);
    canvas.renderAll();
  };

  const handleFillChange = (color: string) => {
    setFill(color);
    updateProperty('fill', color);
  };

  const handleStrokeChange = (color: string) => {
    setStroke(color);
    updateProperty('stroke', color);
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    updateProperty('strokeWidth', width);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    updateProperty('fontSize', size);
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    updateProperty('fontFamily', family);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    updateProperty('text', newText);
  };

  if (!selectedObject) {
    return (
      <div className="property-panel">
        <div className="no-selection">
          <h3>Properties</h3>
          <p>Select an object to edit its properties</p>
        </div>
      </div>
    );
  }

  const isTextObject = selectedObject.type === 'i-text' || selectedObject.type === 'text';

  return (
    <div className="property-panel">
      <h3>Properties</h3>
      
      <div className="property-section">
        <label>Fill Color</label>
        <div className="color-input-group">
          <input
            type="color"
            value={fill}
            onChange={(e) => handleFillChange(e.target.value)}
            className="color-input"
          />
          <span className="color-value">{fill}</span>
        </div>
      </div>

      <div className="property-section">
        <label>Stroke Color</label>
        <div className="color-input-group">
          <input
            type="color"
            value={stroke}
            onChange={(e) => handleStrokeChange(e.target.value)}
            className="color-input"
          />
          <span className="color-value">{stroke}</span>
        </div>
      </div>

      <div className="property-section">
        <label>Stroke Width</label>
        <input
          type="range"
          min="0"
          max="20"
          value={strokeWidth}
          onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
          className="range-input"
        />
        <span className="value-display">{strokeWidth}px</span>
      </div>

      {isTextObject && (
        <>
          <div className="property-section">
            <label>Text</label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="text-input"
              placeholder="Enter text..."
            />
          </div>

          <div className="property-section">
            <label>Font Size</label>
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              className="range-input"
            />
            <span className="value-display">{fontSize}px</span>
          </div>

          <div className="property-section">
            <label>Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => handleFontFamilyChange(e.target.value)}
              className="select-input"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyPanel;