// src/app/history/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { PDFReportGenerator } from '@/lib/pdf-report-generator';
import { SessionData, useSessionStore } from '@/stores/session-store';
import {
  CalendarDays,
  Clock,
  Download,
  FileText,
  Filter,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const { user } = useAuth();
  const { sessions, loading, loadUserSessions, deleteSession } =
    useSessionStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'duration'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>(
    'all'
  );
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(
    new Set()
  );

  // Load sessions on mount
  useEffect(() => {
    loadUserSessions(user);
  }, [user, loadUserSessions]);

  // Filter and sort sessions
  const filteredAndSortedSessions = sessions
    .filter(session => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        session.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.transcribedText
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Score filter
      const score = session.assessment.overallScore;
      const matchesFilter =
        filterBy === 'all' ||
        (filterBy === 'high' && score >= 80) ||
        (filterBy === 'medium' && score >= 60 && score < 80) ||
        (filterBy === 'low' && score < 60);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'score':
          return b.assessment.overallScore - a.assessment.overallScore;
        case 'duration':
          return b.metadata.duration - a.metadata.duration;
        default:
          return 0;
      }
    });

  // Handle session selection
  const toggleSessionSelection = (sessionId: string) => {
    const newSelection = new Set(selectedSessions);
    if (newSelection.has(sessionId)) {
      newSelection.delete(sessionId);
    } else {
      newSelection.add(sessionId);
    }
    setSelectedSessions(newSelection);
  };

  const selectAllSessions = () => {
    if (selectedSessions.size === filteredAndSortedSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(filteredAndSortedSessions.map(s => s.id!)));
    }
  };

  // Handle bulk operations
  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedSessions.size} sessions?`)) {
      for (const sessionId of selectedSessions) {
        await deleteSession(sessionId);
      }
      setSelectedSessions(new Set());
    }
  };

  const handleDownloadReport = async (session: SessionData) => {
    try {
      await PDFReportGenerator.downloadReport(session);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  // Calculate statistics
  const stats = {
    totalSessions: sessions.length,
    averageScore:
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + s.assessment.overallScore, 0) /
              sessions.length
          )
        : 0,
    totalWords: sessions.reduce((sum, s) => sum + s.metadata.wordCount, 0),
    totalDuration: sessions.reduce((sum, s) => sum + s.metadata.duration, 0),
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85)
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (score >= 70)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-6 py-8 pt-24">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading your sessions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Session History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your pronunciation progress over time
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card className="border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSessions}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 backdrop-blur-sm dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span
                  className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}
                >
                  {stats.averageScore}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/20 bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm dark:border-gray-700/30 dark:from-purple-950/10 dark:to-pink-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Words Practiced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalWords.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/20 bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-sm dark:border-gray-700/30 dark:from-orange-950/10 dark:to-red-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Practice Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats.totalDuration)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border border-white/20 bg-gradient-to-br from-white/60 to-blue-50/50 backdrop-blur-sm dark:border-gray-700/30 dark:from-gray-800/60 dark:to-blue-950/10">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={filterBy}
                    onChange={e =>
                      setFilterBy(
                        e.target.value as 'all' | 'high' | 'medium' | 'low'
                      )
                    }
                    className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="all">All Scores</option>
                    <option value="high">High (80%+)</option>
                    <option value="medium">Medium (60-79%)</option>
                    <option value="low">Low (&lt;60%)</option>
                  </select>
                </div>

                <select
                  value={sortBy}
                  onChange={e =>
                    setSortBy(e.target.value as 'date' | 'score' | 'duration')
                  }
                  className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="date">Sort by Date</option>
                  <option value="score">Sort by Score</option>
                  <option value="duration">Sort by Duration</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedSessions.size > 0 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSessions.size} session(s) selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleBulkDelete}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessions List */}
        {filteredAndSortedSessions.length === 0 ? (
          <Card className="border border-white/20 bg-gradient-to-br from-gray-50/50 to-white/50 backdrop-blur-sm dark:border-gray-700/30 dark:from-gray-800/60 dark:to-gray-950/10">
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                No sessions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {sessions.length === 0
                  ? "You haven't completed any practice sessions yet."
                  : 'No sessions match your current filters.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  selectedSessions.size === filteredAndSortedSessions.length
                }
                onChange={selectAllSessions}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select all
              </span>
            </div>

            {/* Session Cards */}
            {filteredAndSortedSessions.map(session => (
              <Card
                key={session.id}
                className="border border-white/20 bg-gradient-to-br from-white/60 to-blue-50/50 backdrop-blur-sm transition-all hover:shadow-lg dark:border-gray-700/30 dark:from-gray-800/60 dark:to-blue-950/10"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start space-x-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedSessions.has(session.id!)}
                        onChange={() => toggleSessionSelection(session.id!)}
                        className="mt-1 rounded border-gray-300"
                      />

                      {/* Session Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center space-x-3">
                          <div
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getScoreBadgeColor(session.assessment.overallScore)}`}
                          >
                            {session.assessment.overallScore}%
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {session.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatDuration(session.metadata.duration)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <FileText className="h-4 w-4" />
                            <span>{session.metadata.wordCount} words</span>
                          </div>
                        </div>

                        <p className="mb-2 line-clamp-2 text-gray-900 dark:text-white">
                          {session.originalText.length > 150
                            ? session.originalText.substring(0, 150) + '...'
                            : session.originalText}
                        </p>

                        {session.metadata.sourceFileName && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Source: {session.metadata.sourceFileName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex items-center space-x-2">
                      <Button
                        onClick={() => handleDownloadReport(session)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteSession(session.id!)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
