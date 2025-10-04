export interface CanvasData {
  id: string;
  name: string;
  canvasState: string; // JSON string of Fabric.js canvas state
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasObject {
  type: 'rect' | 'circle' | 'text' | 'path';
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}