// HTTP client for backup-related endpoints: start/stop/status/report.

import type { ApiError, BackupReport, BackupStatus } from "../types/api";

const BASE = "http://localhost:3000/api/backup";

async function handleJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const err: ApiError = new Error(data?.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

export function startBackup(): Promise<{ started: true }> {
  return fetch(`${BASE}/start`, { method: "POST" })
    .then(res => handleJsonResponse(res));
}

export function stopBackup(): Promise<{ stopped: true }> {
  return fetch(`${BASE}/stop`, { method: "POST" })
    .then(res => handleJsonResponse(res));
}

export function getBackupStatus(): Promise<BackupStatus> {
  return fetch(`${BASE}/status`)
    .then(res => handleJsonResponse<BackupStatus>(res));
}

export function getBackupReport(): Promise<BackupReport> {
  return fetch(`${BASE}/report`)
    .then(res => handleJsonResponse<BackupReport>(res));
}
