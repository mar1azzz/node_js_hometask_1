// HTTP client for Students endpoints.

import type { ApiError, Student } from "../types/api";

const BASE = "http://localhost:3000/api/students";

async function handleJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const err: ApiError = new Error(
      data?.error || `Request failed: ${res.status}`
    );
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data as T;
}

export function getAllStudents(): Promise<Student[]> {
  return fetch(BASE).then((res) => handleJsonResponse<Student[]>(res));
}

export function createStudent(
  payload: Pick<Student, "name" | "age" | "group">
): Promise<Student> {
  return fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => handleJsonResponse<Student>(res));
}

export function replaceStudentsCollection(
  students: Student[]
): Promise<Student[]> {
  return fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(students),
  }).then((res) => handleJsonResponse<Student[]>(res));
}

export function deleteStudent(
  id: string | number
): Promise<{ removed: boolean; id: string }> {
  return fetch(`${BASE}/${id}`, { method: "DELETE" }).then((res) =>
    handleJsonResponse(res)
  );
}

export function updateStudent(
  id: string | number,
  payload: Partial<Student>
): Promise<Student> {
  return fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => handleJsonResponse<Student>(res));
}

export function getStudentsByGroup(groupId: string): Promise<Student[]> {
  return fetch(`${BASE}/group/${groupId}`).then((res) =>
    handleJsonResponse<Student[]>(res)
  );
}

export function getAverageAge(): Promise<{ averageAge: number }> {
  return fetch(`${BASE}/average-age`).then((res) =>
    handleJsonResponse<{ averageAge: number }>(res)
  );
}

export function saveStudents(): Promise<{ saved: true }> {
  return fetch(`${BASE}/save`, { method: "POST" }).then((res) =>
    handleJsonResponse<{ saved: true }>(res)
  );
}

export function loadStudents(): Promise<{ loaded: true }> {
  return fetch(`${BASE}/load`, { method: "POST" }).then((res) =>
    handleJsonResponse<{ loaded: true }>(res)
  );
}
