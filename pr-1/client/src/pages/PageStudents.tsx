/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Main page that orchestrates data fetching, forms, tables, and backup controls.

import { useEffect, useState } from "react";
import {
  Button,
  Group,
  TextInput,
  Notification,
  Space,
  Divider,
  Text,
} from "@mantine/core";

import CuteCatHeader from "../components/CuteCatHeader";
import StudentForm from "../components/StudentForm";
import StudentsTable from "../components/StudentsTable";
import BackupControls from "../components/BackupControls";

import {
  getAllStudents,
  createStudent,
  deleteStudent,
  updateStudent,
  getStudentsByGroup,
  getAverageAge,
  saveStudents,
  loadStudents,
} from "../api/studentsApi";

import type { Student, BackupReport, BackupStatus } from "../types/api";

import {
  startBackup,
  stopBackup,
  getBackupStatus,
  getBackupReport,
} from "../api/backupApi";

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as any).message;
    if (typeof m === "string") return m;
  }
  return "Unexpected error";
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [filterGroup, setFilterGroup] = useState("");
  const [averageAge, setAverageAge] = useState<number | null>(null);

  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);
  const [backupReport, setBackupReport] = useState<BackupReport | null>(null);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function showError(msg: string) {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 4000);
  }

  function showSuccess(msg: string) {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  async function loadAll() {
    try {
      setLoadingStudents(true);
      const data = await getAllStudents();
      setStudents(data || []);
    } catch (err) {
      showError(extractErrorMessage(err));
    } finally {
      setLoadingStudents(false);
    }
  }

  useEffect(() => {
    void loadAll();
    void refreshBackupStatus();
  }, []);

  async function handleCreateOrUpdateStudent(payload: {
    name: string;
    age: number;
    group: string;
  }) {
    setSubmitting(true);
    try {
      if (editingStudent) {
        const updated = await updateStudent(editingStudent.id, payload);
        setStudents((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        setEditingStudent(null);
        showSuccess("Student updated");
      } else {
        const created = await createStudent(payload);
        setStudents((prev) => [...prev, created]);
        showSuccess("Student created");
      }
    } catch (err) {
      showError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteStudent(id: string) {
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showSuccess("Student deleted");
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  async function handleFilterByGroup() {
    if (!filterGroup) {
      await loadAll();
      return;
    }

    try {
      setLoadingStudents(true);
      const data = await getStudentsByGroup(filterGroup.trim());
      setStudents(data || []);
    } catch (err) {
      showError(extractErrorMessage(err));
    } finally {
      setLoadingStudents(false);
    }
  }

  async function handleAverageAge() {
    try {
      const res = await getAverageAge();
      setAverageAge(res.averageAge);
      showSuccess(`Average age: ${res.averageAge.toFixed(2)}`);
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  async function handleSave() {
    try {
      await saveStudents();
      showSuccess("Students saved to JSON");
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  async function handleLoad() {
    try {
      await loadStudents();
      await loadAll();
      showSuccess("Students loaded from JSON");
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  async function refreshBackupStatus() {
    try {
      const status = await getBackupStatus();
      setBackupStatus(status);
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  async function handleStartBackup() {
    try {
      await startBackup();
      await refreshBackupStatus();
      showSuccess("Backup started");
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  async function handleStopBackup() {
    try {
      await stopBackup();
      await refreshBackupStatus();
      showSuccess("Backup stopped");
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  async function handleShowReport() {
    try {
      const report = await getBackupReport();
      setBackupReport(report);
      showSuccess("Backup report loaded");
    } catch (err) {
      showError(extractErrorMessage(err));
    }
  }

  return (
    <>
      <CuteCatHeader />

      {errorMessage && (
        <Notification color="red" onClose={() => setErrorMessage("")} mb="sm">
          {errorMessage}
        </Notification>
      )}

      {successMessage && (
        <Notification
          color="green"
          onClose={() => setSuccessMessage("")}
          mb="sm"
        >
          {successMessage}
        </Notification>
      )}

      <StudentForm
        onSubmit={handleCreateOrUpdateStudent}
        isSubmitting={submitting}
        initialValues={editingStudent}
        onCancelEdit={() => setEditingStudent(null)}
      />

      <Group align="flex-end" gap="sm" mb="xs">
        <TextInput
          label="Filter by group"
          placeholder="101"
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.currentTarget.value)}
          style={{ maxWidth: 160 }}
        />
        <Button
          size="xs"
          variant="light"
          color="bluecat.6"
          onClick={handleFilterByGroup}
        >
          Apply filter
        </Button>
        <Button
          size="xs"
          variant="subtle"
          onClick={() => {
            setFilterGroup("");
            void loadAll();
          }}
        >
          Reset
        </Button>

        <Button
          size="xs"
          variant="outline"
          color="violetcat.6"
          onClick={handleAverageAge}
        >
          Average age
        </Button>

        <Button size="xs" variant="subtle" onClick={handleSave}>
          Save
        </Button>
        <Button size="xs" variant="subtle" onClick={handleLoad}>
          Load
        </Button>
      </Group>

      {averageAge != null && (
        <Text size="sm" c="dimmed">
          Current average age:{" "}
          <strong>{Number(averageAge).toFixed(2)}</strong>
        </Text>
      )}

      <Space h="sm" />

      {loadingStudents ? (
        <Text>Loading students...</Text>
      ) : (
        <StudentsTable
          students={students}
          onEdit={setEditingStudent}
          onDelete={handleDeleteStudent}
        />
      )}

      <Divider my="lg" />

      <BackupControls
        status={backupStatus}
        onStart={handleStartBackup}
        onStop={handleStopBackup}
        onRefreshStatus={refreshBackupStatus}
        onShowReport={handleShowReport}
      />

      {backupReport && (
        <>
          <Space h="sm" />
          <Text size="sm" c="dimmed">
            Backup files: {backupReport.filesCount} · Average students per
            backup: {backupReport.averageStudents.toFixed(2)}
          </Text>
        </>
      )}
    </>
  );
}
