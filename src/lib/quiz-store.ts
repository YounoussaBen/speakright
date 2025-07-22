import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { QuizSession, QuizSessionItem } from './quiz-engine';

export interface UserQuizStats {
  userId: string;
  totalSessions: number;
  totalWords: number;
  totalSentences: number;
  averageScore: number;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  longestStreak: number;
  currentStreak: number;
  totalPlayTime: number; // in minutes
  lastPlayedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  levelProgress: {
    beginner: { completed: number; accuracy: number };
    intermediate: { completed: number; accuracy: number };
    advanced: { completed: number; accuracy: number };
  };
  categoryProgress: {
    common: { completed: number; accuracy: number };
    business: { completed: number; accuracy: number };
    academic: { completed: number; accuracy: number };
    technical: { completed: number; accuracy: number };
  };
}

export interface QuizSessionRecord {
  id: string;
  userId: string;
  startedAt: Timestamp;
  completedAt?: Timestamp | undefined;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  score: number;
  streak: number;
  correctAnswers: number;
  totalAttempts: number;
  duration: number; // in seconds
  items: QuizSessionItemRecord[];
}

export interface QuizSessionItemRecord {
  id: string;
  itemType: 'word' | 'sentence';
  content: string;
  phonetic?: string | undefined;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'common' | 'business' | 'academic' | 'technical';
  targetScore: number;
  attempts: PronunciationAttemptRecord[];
  completed: boolean;
  bestScore: number;
}

export interface PronunciationAttemptRecord {
  id: string;
  transcription: string;
  pronunciationScore: number;
  accuracy: number;
  fluency: number;
  overall: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  timestamp: Timestamp;
}

class QuizStore {
  private readonly COLLECTION_SESSIONS = 'quiz_sessions';
  private readonly COLLECTION_STATS = 'quiz_stats';

  // Get or create user stats
  async getUserStats(userId: string): Promise<UserQuizStats> {
    try {
      const statsDoc = await getDoc(doc(db, this.COLLECTION_STATS, userId));

      if (statsDoc.exists()) {
        const data = statsDoc.data();
        return {
          ...data,
          lastPlayedAt: data.lastPlayedAt?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserQuizStats;
      } else {
        // Create default stats
        const defaultStats: UserQuizStats = {
          userId,
          totalSessions: 0,
          totalWords: 0,
          totalSentences: 0,
          averageScore: 0,
          currentLevel: 'beginner',
          longestStreak: 0,
          currentStreak: 0,
          totalPlayTime: 0,
          lastPlayedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          levelProgress: {
            beginner: { completed: 0, accuracy: 0 },
            intermediate: { completed: 0, accuracy: 0 },
            advanced: { completed: 0, accuracy: 0 },
          },
          categoryProgress: {
            common: { completed: 0, accuracy: 0 },
            business: { completed: 0, accuracy: 0 },
            academic: { completed: 0, accuracy: 0 },
            technical: { completed: 0, accuracy: 0 },
          },
        };

        await this.saveUserStats(defaultStats);
        return defaultStats;
      }
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Save user stats
  async saveUserStats(stats: UserQuizStats): Promise<void> {
    try {
      const statsData = {
        ...stats,
        lastPlayedAt: Timestamp.fromDate(stats.lastPlayedAt),
        createdAt: Timestamp.fromDate(stats.createdAt),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await setDoc(doc(db, this.COLLECTION_STATS, stats.userId), statsData);
    } catch (error) {
      console.error('Error saving user stats:', error);
      throw error;
    }
  }

  // Save quiz session
  async saveQuizSession(session: QuizSession): Promise<void> {
    try {
      const sessionRecord = {
        id: session.id,
        userId: session.userId,
        startedAt: Timestamp.fromDate(session.startedAt),
        completedAt: session.completedAt
          ? Timestamp.fromDate(session.completedAt)
          : undefined,
        currentLevel: session.currentLevel,
        score: session.score,
        streak: session.streak,
        correctAnswers: session.correctAnswers,
        totalAttempts: session.totalAttempts,
        duration: session.completedAt
          ? Math.round(
              (session.completedAt.getTime() - session.startedAt.getTime()) /
                1000
            )
          : 0,
        items: session.items.map(item => this.convertSessionItem(item)),
      };

      await setDoc(
        doc(db, this.COLLECTION_SESSIONS, session.id),
        sessionRecord
      );

      // Update user stats
      await this.updateUserStatsFromSession(session);
    } catch (error) {
      console.error('Error saving quiz session:', error);
      throw error;
    }
  }

  // Get user's recent sessions
  async getUserSessions(
    userId: string,
    limitCount = 10
  ): Promise<QuizSessionRecord[]> {
    try {
      const sessionsQuery = query(
        collection(db, this.COLLECTION_SESSIONS),
        where('userId', '==', userId),
        orderBy('startedAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(sessionsQuery);
      return snapshot.docs.map(doc => doc.data() as QuizSessionRecord);
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  // Get leaderboard (top performers)
  async getLeaderboard(limitCount = 50): Promise<
    Array<{
      userId: string;
      displayName?: string;
      averageScore: number;
      totalSessions: number;
      currentLevel: string;
    }>
  > {
    try {
      const statsQuery = query(
        collection(db, this.COLLECTION_STATS),
        orderBy('averageScore', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(statsQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data() as UserQuizStats;
        return {
          userId: data.userId,
          averageScore: data.averageScore,
          totalSessions: data.totalSessions,
          currentLevel: data.currentLevel,
        };
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  private convertSessionItem(item: QuizSessionItem): QuizSessionItemRecord {
    const content = item.quizItem.content as {
      word?: string;
      text?: string;
      phonetic?: string;
      difficulty?: string;
      category?: string;
    };
    return {
      id: item.id,
      itemType: item.quizItem.type,
      content:
        item.quizItem.type === 'word' ? content.word || '' : content.text || '',
      phonetic: content.phonetic || undefined,
      difficulty:
        (content.difficulty as 'beginner' | 'intermediate' | 'advanced') ||
        'beginner',
      category:
        (content.category as
          | 'common'
          | 'business'
          | 'academic'
          | 'technical') || 'common',
      targetScore: item.quizItem.targetScore,
      attempts: item.attempts.map(attempt => ({
        id: attempt.id,
        transcription: attempt.transcription,
        pronunciationScore: attempt.pronunciationScore,
        accuracy: attempt.feedback.accuracy,
        fluency: attempt.feedback.fluency,
        overall: attempt.feedback.overall,
        timestamp: Timestamp.fromDate(attempt.timestamp),
      })),
      completed: item.completed,
      bestScore: item.bestScore,
    };
  }

  private async updateUserStatsFromSession(
    session: QuizSession
  ): Promise<void> {
    try {
      const currentStats = await this.getUserStats(session.userId);

      // Calculate session duration in minutes
      const sessionDuration = session.completedAt
        ? Math.round(
            (session.completedAt.getTime() - session.startedAt.getTime()) /
              (1000 * 60)
          )
        : 0;

      // Count words and sentences
      const words = session.items.filter(
        item => item.quizItem.type === 'word'
      ).length;
      const sentences = session.items.filter(
        item => item.quizItem.type === 'sentence'
      ).length;

      // Calculate new average score
      const totalScore =
        currentStats.averageScore * currentStats.totalSessions + session.score;
      const newTotalSessions = currentStats.totalSessions + 1;
      const newAverageScore = totalScore / newTotalSessions;

      // Update level progress
      const levelProgress = { ...currentStats.levelProgress };
      const sessionAccuracy =
        session.totalAttempts > 0
          ? (session.correctAnswers / session.totalAttempts) * 100
          : 0;

      levelProgress[session.currentLevel] = {
        completed:
          levelProgress[session.currentLevel]!.completed + session.items.length,
        accuracy: sessionAccuracy,
      };

      // Update category progress (simplified - using session level as proxy)
      const categoryProgress = { ...currentStats.categoryProgress };

      // Update streak
      const longestStreak = Math.max(
        currentStats.longestStreak,
        session.streak
      );

      const updatedStats: UserQuizStats = {
        ...currentStats,
        totalSessions: newTotalSessions,
        totalWords: currentStats.totalWords + words,
        totalSentences: currentStats.totalSentences + sentences,
        averageScore: newAverageScore,
        currentLevel: session.currentLevel,
        longestStreak,
        currentStreak: session.streak,
        totalPlayTime: currentStats.totalPlayTime + sessionDuration,
        lastPlayedAt: new Date(),
        updatedAt: new Date(),
        levelProgress,
        categoryProgress,
      };

      await this.saveUserStats(updatedStats);
    } catch (error) {
      console.error('Error updating user stats from session:', error);
    }
  }
}

export const quizStore = new QuizStore();
