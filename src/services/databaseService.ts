// src/services/databaseService.ts
import { db } from "../lib/firebase";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export async function getCollectionData(collectionName: string) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addDocument(collectionName: string, data: any) {
  await addDoc(collection(db, collectionName), data);
}

export async function updateDocument(collectionName: string, id: string, data: any) {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, data);
}

export async function deleteDocument(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}
