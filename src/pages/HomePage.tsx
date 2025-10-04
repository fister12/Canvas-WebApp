import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { canvasService } from '../services/canvasService';
import { Palette, Plus, Sparkles } from 'lucide-react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateCanvas = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      // First test the connection
      const connectionOk = await canvasService.testConnection();
      if (!connectionOk) {
        throw new Error('Firebase connection failed. Please check your configuration.');
      }
      
      const canvasId = await canvasService.createCanvas('Untitled Canvas');
      console.log('Canvas created with ID:', canvasId);
      navigate(`/canvas/${canvasId}`);
    } catch (error) {
      console.error('Failed to create canvas:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to create canvas: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <Palette size={64} />
          </div>
          <h1 className="hero-title">
            Canvas Editor
            <Sparkles className="sparkle-icon" size={24} />
          </h1>
          <p className="hero-subtitle">
            Create and edit beautiful designs with our intuitive canvas editor.
            Add shapes, text, and unleash your creativity.
          </p>
          
          <button 
            className={`create-button ${isCreating ? 'creating' : ''}`}
            onClick={handleCreateCanvas}
            disabled={isCreating}
          >
            <Plus size={20} />
            {isCreating ? 'Creating Canvas...' : 'Create New Canvas'}
          </button>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔷</div>
            <h3>Shapes & Objects</h3>
            <p>Add rectangles, circles, and custom shapes with ease</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✏️</div>
            <h3>Text Editing</h3>
            <p>Add and customize text with different fonts and colors</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Free Drawing</h3>
            <p>Use the pen tool to draw freeform shapes and sketches</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Cloud Save</h3>
            <p>Your work is automatically saved to the cloud</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;