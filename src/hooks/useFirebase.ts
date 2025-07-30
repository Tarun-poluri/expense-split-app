import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

export const useCollection = (collectionName: string) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: any[] = [];
      snapshot.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setDocuments(results);
    }, (err) => {
      setError(err.message);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const addDocument = async (docData: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateDocument = async (id: string, updates: any) => {
    try {
      await updateDoc(doc(db, collectionName, id), updates);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { documents, error, addDocument, updateDocument, deleteDocument };
};

export const useGroupExpenses = (groupId: string) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, 'expenses'),
      where('groupId', '==', groupId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: any[] = [];
      snapshot.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setExpenses(results);
    }, (err) => {
      setError(err.message);
    });

    return () => unsubscribe();
  }, [groupId]);

  return { expenses, error };
};