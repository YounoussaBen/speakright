// src/stores/session-store.ts
import { auth, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { create } from 'zustand';

export interface PronunciationAssessment {
  overallScore: number;
  accuracyScore: number;
  fluencyScore: number;
  wordLevelScores: Array<{
    word: string;
    originalWord: string;
    score: number;
    phonemes: Array<{
      expected: string;
      actual: string;
      score: number;
    }>;
    feedback: string[];
  }>;
  suggestions: string[];
}

export interface SessionData {
  id?: string;
  userId?: string | undefined;
  originalText: string;
  transcribedText: string;
  audioUrl?: string;
  assessment: PronunciationAssessment;
  metadata: {
    duration: number;
    wordCount: number;
    sourceType: 'manual' | 'file' | 'sample';
    sourceFileName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface SessionStore {
  // Current session state
  currentSession: SessionData | null;
  sessions: SessionData[];
  loading: boolean;

  // Actions
  createSession: (
    sessionData: Omit<SessionData, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<SessionData>;
  updateSession: (
    sessionId: string,
    updates: Partial<SessionData>
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  loadUserSessions: (user: User | null) => Promise<void>;
  setCurrentSession: (session: SessionData | null) => void;

  // Local session handling for anonymous users
  saveLocalSession: (session: SessionData) => void;
  loadLocalSessions: () => SessionData[];
  clearLocalSessions: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  sessions: [],
  loading: false,

  createSession: async sessionData => {
    const newSession: SessionData = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ✅ Check if user is authenticated and session has valid userId
    if (
      sessionData.userId &&
      sessionData.userId.trim() !== '' &&
      auth.currentUser
    ) {
      // Save to Firestore for authenticated users
      try {
        const docRef = await addDoc(collection(db, 'sessions'), {
          ...newSession,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        newSession.id = docRef.id;
      } catch (error) {
        console.error('Error saving session to Firestore:', error);
        // Fallback to local storage
        get().saveLocalSession(newSession);
      }
    } else {
      // Save locally for anonymous users or sessions without valid userId
      get().saveLocalSession(newSession);
    }

    set(state => ({
      sessions: [newSession, ...state.sessions],
      currentSession: newSession,
    }));

    return newSession;
  },

  updateSession: async (sessionId, updates) => {
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    const session = get().sessions.find(s => s.id === sessionId);
    if (!session) return;

    // ✅ Check if session belongs to authenticated user
    if (
      session.userId &&
      session.userId.trim() !== '' &&
      auth.currentUser &&
      session.userId === auth.currentUser.uid
    ) {
      // Update in Firestore
      try {
        await updateDoc(doc(db, 'sessions', sessionId), {
          ...updatedData,
          updatedAt: Timestamp.now(),
        });
      } catch (error) {
        console.error('Error updating session in Firestore:', error);
      }
    } else {
      // Update local storage
      const localSessions = get().loadLocalSessions();
      const updatedSessions = localSessions.map(s =>
        s.id === sessionId ? { ...s, ...updatedData } : s
      );
      localStorage.setItem(
        'pronunciation_sessions',
        JSON.stringify(updatedSessions)
      );
    }

    set(state => ({
      sessions: state.sessions.map(s =>
        s.id === sessionId ? { ...s, ...updatedData } : s
      ),
    }));
  },

  deleteSession: async sessionId => {
    const session = get().sessions.find(s => s.id === sessionId);
    if (!session) {
      console.warn('Session not found:', sessionId);
      return;
    }

    try {
      // ✅ Check if this is a Firestore session that belongs to current user
      if (session.userId && session.userId.trim() !== '' && auth.currentUser) {
        // Ensure user is authenticated and session belongs to them
        if (session.userId !== auth.currentUser.uid) {
          throw new Error('Session does not belong to current user');
        }

        // Delete from Firestore
        await deleteDoc(doc(db, 'sessions', sessionId));
      } else {
        // Handle local storage deletion for anonymous sessions
        const localSessions = get().loadLocalSessions();
        const updatedSessions = localSessions.filter(s => s.id !== sessionId);
        localStorage.setItem(
          'pronunciation_sessions',
          JSON.stringify(updatedSessions)
        );
      }

      // ✅ Only update UI on successful deletion
      set(state => ({
        sessions: state.sessions.filter(s => s.id !== sessionId),
        currentSession:
          state.currentSession?.id === sessionId ? null : state.currentSession,
      }));
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error; // Re-throw for UI error handling
    }
  },

  loadUserSessions: async user => {
    set({ loading: true });

    let sessions: SessionData[] = [];

    if (user) {
      // Load from Firestore for authenticated users
      try {
        // Simple query without orderBy to avoid index requirement
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        })) as SessionData[];

        // Sort in memory instead of in Firestore
        sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      } catch (error) {
        console.error('Error loading sessions from Firestore:', error);
      }
    }

    // Always load local sessions (for anonymous or as backup)
    const localSessions = get().loadLocalSessions();

    // Merge sessions, avoiding duplicates
    const allSessions = [...sessions];
    localSessions.forEach(localSession => {
      if (!allSessions.some(s => s.id === localSession.id)) {
        allSessions.push(localSession);
      }
    });

    // Sort by creation date
    allSessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    set({ sessions: allSessions, loading: false });
  },

  setCurrentSession: session => {
    set({ currentSession: session });
  },

  saveLocalSession: session => {
    const localSessions = get().loadLocalSessions();
    const updatedSessions = [
      session,
      ...localSessions.filter(s => s.id !== session.id),
    ];

    // Keep only last 50 sessions to avoid storage bloat
    const limitedSessions = updatedSessions.slice(0, 50);

    localStorage.setItem(
      'pronunciation_sessions',
      JSON.stringify(limitedSessions)
    );
  },

  loadLocalSessions: (): SessionData[] => {
    try {
      const stored = localStorage.getItem('pronunciation_sessions');
      if (!stored) return [];

      const sessions: SessionData[] = JSON.parse(stored);
      return sessions.map((session: SessionData) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading local sessions:', error);
      return [];
    }
  },

  clearLocalSessions: () => {
    localStorage.removeItem('pronunciation_sessions');
    set(state => ({
      sessions: state.sessions.filter(s => s.userId), // Keep only Firestore sessions
    }));
  },
}));
