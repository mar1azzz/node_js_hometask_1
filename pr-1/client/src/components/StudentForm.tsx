/* eslint-disable react-hooks/set-state-in-effect */
// Student creation/editing form with proper TypeScript types.

import {
  Button,
  Group,
  NumberInput,
  TextInput,
  Card,
  Text,
} from "@mantine/core";
import { useLayoutEffect, useState, type FormEvent } from "react";
import type { Student } from "../types/api";

interface StudentFormValues {
  name: string;
  age: number;
  group: string;
}

interface StudentFormProps {
  onSubmit: (values: StudentFormValues) => void;
  isSubmitting: boolean;
  initialValues?: Student | null;
  onCancelEdit: () => void;
}

export default function StudentForm({
  onSubmit,
  isSubmitting,
  initialValues = null,
  onCancelEdit,
}: StudentFormProps) {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [group, setGroup] = useState<string>("");

  useLayoutEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setAge(initialValues.age);
      setGroup(String(initialValues.group));
    } else {
      setName("");
      setAge(null);
      setGroup("");
    }
  }, [initialValues]);

  const isEditing = Boolean(initialValues);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || age == null || !group) return;

    onSubmit({
      name: name.trim(),
      age: Number(age),
      group: group.trim(),
    });
  };

  return (
    <Card shadow="sm" radius="md" withBorder mb="md">
      <Text fw={600} mb="xs" c="violetcat.6">
        {isEditing ? "Edit student" : "Add new student"}
      </Text>

      <form onSubmit={handleSubmit}>
        <Group align="flex-end" gap="md">
          <TextInput
            label="Name"
            placeholder="Mittens"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />

          <NumberInput
            label="Age"
            placeholder="18"
            value={Number(age)}
            onChange={(value) =>
              setAge(value === "" ? null : Number(value))
            }
            min={1}
            required
          />

          <TextInput
            label="Group"
            placeholder="101"
            value={group}
            onChange={(e) => setGroup(e.currentTarget.value)}
            required
          />

          <Group gap="xs">
            <Button
              type="submit"
              loading={isSubmitting}
              variant="filled"
              color="violetcat.6"
            >
              {isEditing ? "Save" : "Add"}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="subtle"
                color="pinkcat.3"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </Group>
        </Group>
      </form>
    </Card>
  );
}
