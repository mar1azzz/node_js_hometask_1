// Table for displaying students list with actions: edit, delete.

import { Table, ActionIcon, Group, Text, Badge } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Student } from "../types/api";

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export default function StudentsTable({
  students,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  if (!students || students.length === 0) {
    return (
      <Text c="dimmed" mt="sm">
        No students yet. Add someone using the form above 🐱
      </Text>
    );
  }

  const rows = students.map((s) => (
    <tr key={s.id}>
      <td>
        <Text fw={500}>{s.id}</Text>
      </td>
      <td>{s.name}</td>
      <td>{s.age}</td>
      <td>
        <Badge color="bluecat.6" variant="light" tt="none">
          Group {s.group}
        </Badge>
      </td>
      <td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="violetcat.6"
            onClick={() => onEdit(s)}
            aria-label="Edit student"
          >
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="pinkcat.6"
            onClick={() => onDelete(s.id)}
            aria-label="Delete student"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Table striped highlightOnHover verticalSpacing="xs" mt="md">
      <thead>
        <tr>
          <th style={{ width: "12%" }}>ID</th>
          <th style={{ width: "28%" }}>Name</th>
          <th style={{ width: "10%" }}>Age</th>
          <th style={{ width: "20%" }}>Group</th>
          <th style={{ width: "30%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
