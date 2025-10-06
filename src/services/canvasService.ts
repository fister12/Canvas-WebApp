import { db } from './firebase';
import { collection, doc, addDoc, getDoc, updateDoc, connectFirestoreEmulator } from 'firebase/firestore';
import { CanvasData } from '../types/canvas';

const COLLECTION_NAME = 'canvases';

// Test Firebase connection
const testConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Database object:', db);
    
    // Try to create a collection reference
    const testCollection = collection(db, 'test');
    console.log('Collection reference created successfully');
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

export const canvasService = {
  // Test connection method
  testConnection,
  // Create a new canvas document
  async createCanvas(name: string = 'Untitled Canvas'): Promise<string> {
    try {
      console.log('Attempting to create canvas with name:', name);
      console.log('Database instance:', db);
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name,
        canvasState: JSON.stringify({}),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('Canvas created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Detailed error creating canvas:', error);
      
      // Check if it's a Firebase configuration issue
      if (error instanceof Error) {
        if (error.message.includes('projectId')) {
          throw new Error('Firebase project not configured properly. Check your Firebase config.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Permission denied. Please enable Firestore Database in your Firebase console.');
        }
        if (error.message.includes('network')) {
          throw new Error('Network error. Check your internet connection.');
        }
      }
      
      throw new Error(`Failed to create canvas: ${error}`);
    }
  },

  // Get canvas by ID
  async getCanvas(id: string): Promise<CanvasData | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as CanvasData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting canvas:', error);
      throw error;
    }
  },

  // Save canvas state
  async saveCanvas(id: string, canvasState: string, name?: string): Promise<void> {
    try {
      console.log('Attempting to save canvas:', { id, name, canvasStateLength: canvasState.length });
      
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData: any = {
        canvasState,
        updatedAt: new Date(),
      };
      
      if (name) {
        updateData.name = name;
      }
      
      console.log('Update data prepared:', { ...updateData, canvasState: canvasState.substring(0, 100) + '...' });
      
      await updateDoc(docRef, updateData);
      console.log('Canvas saved successfully');
    } catch (error) {
      console.error('Detailed error saving canvas:', error);
      
      // Enhanced error handling
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          throw new Error(`Permission denied: Your Firestore security rules are blocking this write operation. Please check your Firebase Console security rules.`);
        }
        if (error.message.includes('not-found')) {
          throw new Error(`Canvas not found: The canvas with ID "${id}" doesn't exist. It may have been deleted.`);
        }
        if (error.message.includes('unavailable')) {
          throw new Error(`Firestore unavailable: The database is temporarily unavailable. Please try again.`);
        }
        if (error.message.includes('unauthenticated')) {
          throw new Error(`Authentication required: Please check your Firebase authentication setup.`);
        }
        if (error.message.includes('quota-exceeded')) {
          throw new Error(`Quota exceeded: Your Firebase project has exceeded its quota limits.`);
        }
      }
      
      throw new Error(`Failed to save canvas: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  // Update canvas name
  async updateCanvasName(id: string, name: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        name,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating canvas name:', error);
      throw error;
    }
  },
};