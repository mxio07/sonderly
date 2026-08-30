import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { JournalEntry } from '../types';

// Fallback configuration if json is missing fields
const firebaseConfig = {
  projectId: firebaseConfigData.projectId || "gen-lang-client-0449086372",
  appId: firebaseConfigData.appId || "1:258127807556:web:27b2e3f29ded07ee3f6811",
  apiKey: firebaseConfigData.apiKey || "AIzaSyBrh919yqsnTonJU4wx2cCV28TVQKreAuw",
  authDomain: firebaseConfigData.authDomain || "gen-lang-client-0449086372.firebaseapp.com",
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId || "ai-studio-reflectaijournal-72b59175-c689-4620-a190-cecc2c184049",
  storageBucket: firebaseConfigData.storageBucket || "gen-lang-client-0449086372.firebasestorage.app",
  messagingSenderId: firebaseConfigData.messagingSenderId || "258127807556",
};

// Initialize Firebase App instance singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Ensure Firestore binds to the provisioned database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Persistence configuration
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Auth persistence configuration notice:', err);
  });
} catch (err) {
  console.warn('Error setting persistence:', err);
}

// 1. Strict Undefined-Stripping (Zero-Crash Payload Hygiene)
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value === undefined) {
      return null;
    }
    return value;
  }));
}

// Authentication Helpers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// User Profile Syncer
export async function syncUserProfile(user: FirebaseUser): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const profilePayload = sanitizeForFirestore({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous User',
      photoURL: user.photoURL || '',
      lastLogin: Date.now(),
    });
    await setDoc(userRef, profilePayload, { merge: true });
  } catch (err) {
    console.warn('Notice: Failed syncing user document to Firestore:', err);
  }
}

// Entry Data Management Functions (Owner-bound: /users/{userId}/entries/{entryId})
export async function saveJournalEntry(userId: string, entry: JournalEntry): Promise<void> {
  if (!userId) throw new Error('User ID is required to save entry');
  if (!entry.id) throw new Error('Entry ID is required');

  const entryRef = doc(db, 'users', userId, 'entries', entry.id);
  const cleanPayload = sanitizeForFirestore({
    ...entry,
    userId,
    updatedAt: Date.now(),
  });

  await setDoc(entryRef, cleanPayload, { merge: true });

  // Also maintain interaction log in /users/{userId}/interactions/{interactionId} for campaign verification
  try {
    const interactionRef = doc(db, 'users', userId, 'interactions', `log_${entry.id}`);
    await setDoc(interactionRef, sanitizeForFirestore({
      entryId: entry.id,
      title: entry.title,
      turnsCount: entry.messages?.length || 0,
      hasSummary: Boolean(entry.summaryData),
      updatedAt: Date.now(),
    }), { merge: true });
  } catch (logErr) {
    console.warn('Notice: interaction log recording:', logErr);
  }
}

export async function deleteJournalEntry(userId: string, entryId: string): Promise<void> {
  if (!userId || !entryId) return;
  const entryRef = doc(db, 'users', userId, 'entries', entryId);
  await deleteDoc(entryRef);
}

export function subscribeToUserEntries(
  userId: string, 
  onEntries: (entries: JournalEntry[]) => void,
  onError?: (err: Error) => void
) {
  if (!userId) return () => {};

  const entriesRef = collection(db, 'users', userId, 'entries');
  const q = query(entriesRef, orderBy('updatedAt', 'desc'));

  return onSnapshot(
    q, 
    (snapshot) => {
      const items: JournalEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as JournalEntry);
      });
      onEntries(items);
    },
    (error) => {
      console.error('Firestore snapshot subscription error:', error);
      if (onError) onError(error);
    }
  );
}

export { onAuthStateChanged };
export type { FirebaseUser };
