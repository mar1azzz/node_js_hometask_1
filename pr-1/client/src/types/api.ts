/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiError extends Error {
  status?: number;
  payload?: any;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  group: string | number;
}

export interface BackupStatus {
  running: boolean;
  intervalMs: number;
  pendingIntervalsInRow: number;
  maxPendingIntervals: number;
}

export interface BackupReport {
  filesCount: number;

  latestBackup: {
    fileName: string;
    createdAt: string | null;
  } | null;

  studentsById: Array<{
    id: string;
    amount: number;
  }>;

  averageStudents: number;
}
