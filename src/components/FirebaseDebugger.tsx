import React, { useEffect } from 'react';
import { canvasService } from '../services/canvasService';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

const FirebaseDebugger: React.FC = () => {
  const logResult = (message: string, isError = false) => {
    const prefix = isError ? '🔥 FIREBASE DEBUG ERROR:' : '🔥 FIREBASE DEBUG SUCCESS:';
    const style = isError ? 'color: red; font-weight: bold;' : 'color: green; font-weight: bold;';
    console.log(`%c${prefix} ${message}`, style);
  };

  const runDiagnostics = async () => {
    console.log('%c🔥 FIREBASE DIAGNOSTICS STARTING...', 'color: blue; font-size: 16px; font-weight: bold;');
    console.log('═══════════════════════════════════════════════════════════');
    
    try {
      // Test 1: Basic Firebase connection
      console.log('%c🔥 TEST 1: Firebase Connection', 'color: blue; font-weight: bold;');
      const connectionTest = await canvasService.testConnection();
      logResult(`Firebase connection: ${connectionTest ? 'SUCCESS' : 'FAILED'}`, !connectionTest);

      // Test 2: Try to read from Firestore
      console.log('%c🔥 TEST 2: Firestore Read Permissions', 'color: blue; font-weight: bold;');
      try {
        const canvasesCollection = collection(db, 'canvases');
        const q = query(canvasesCollection, limit(1));
        const querySnapshot = await getDocs(q);
        logResult(`Firestore read: SUCCESS (${querySnapshot.size} documents found)`);
      } catch (readError: any) {
        logResult(`Firestore read: FAILED - ${readError.message}`, true);
        console.error('🔥 Full read error:', readError);
      }

      // Test 3: Try to write to Firestore
      console.log('%c🔥 TEST 3: Firestore Write Permissions', 'color: blue; font-weight: bold;');
      try {
        const testDoc = await addDoc(collection(db, 'canvases'), {
          name: 'TEST_DOCUMENT_DELETE_ME',
          canvasState: '{}',
          createdAt: new Date(),
          updatedAt: new Date(),
          isTest: true
        });
        logResult(`Firestore write: SUCCESS (Created test document: ${testDoc.id})`);
      } catch (writeError: any) {
        logResult(`Firestore write: FAILED - ${writeError.message}`, true);
        console.error('🔥 Full write error:', writeError);
      }

      // Test 4: Try canvas service create method
      console.log('%c🔥 TEST 4: Canvas Service Creation', 'color: blue; font-weight: bold;');
      try {
        const canvasId = await canvasService.createCanvas('Test Canvas - Delete Me');
        logResult(`Canvas creation: SUCCESS (Canvas ID: ${canvasId})`);
      } catch (canvasError: any) {
        logResult(`Canvas creation: FAILED - ${canvasError.message}`, true);
        console.error('🔥 Full canvas creation error:', canvasError);
      }

      console.log('%c🔥 FIREBASE DIAGNOSTICS COMPLETED', 'color: blue; font-size: 16px; font-weight: bold;');
      console.log('═══════════════════════════════════════════════════════════');
    } catch (error: any) {
      logResult(`Overall diagnostic: FAILED - ${error.message}`, true);
      console.error('🔥 Full diagnostic error:', error);
    }
  };

  useEffect(() => {
    // Run diagnostics after a short delay to ensure Firebase is initialized
    const timer = setTimeout(() => {
      runDiagnostics();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Return null - no visual component
  return null;
};

export default FirebaseDebugger;