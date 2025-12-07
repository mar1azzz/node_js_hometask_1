// Controls for backup mechanism: start, stop, status, report. Expects callbacks from parent and displays current status.

import { Button, Group, Card, Text, Badge, Stack } from "@mantine/core";
import type { BackupStatus } from "../types/api";

interface BackupControlsProps {
  status: BackupStatus | null;
  onStart: () => Promise<void> | void;
  onStop: () => Promise<void> | void;
  onRefreshStatus: () => Promise<void> | void;
  onShowReport: () => Promise<void> | void;
}

export default function BackupControls({
  status,
  onStart,
  onStop,
  onRefreshStatus,
}: BackupControlsProps) {
  const running = status?.running ?? false;

  return (
    <Card withBorder radius="md" shadow="xs" mt="lg">
      <Group justify="space-between" mb="xs" align="center">
        <Text fw={600}>Backup controls</Text>
        <Badge
          color={running ? "bluecat.6" : "pinkcat.6"}
          variant="filled"
          radius="xl"
        >
          {running ? "Running" : "Stopped"}
        </Badge>
      </Group>

      <Stack gap="xs">
        <Group gap="xs">
          <Button
            size="xs"
            color="bluecat.6"
            variant="light"
            onClick={onStart}
            disabled={running}
          >
            Start backup
          </Button>
          <Button
            size="xs"
            color="pinkcat.6"
            variant="light"
            onClick={onStop}
            disabled={!running}
          >
            Stop backup
          </Button>
          <Button size="xs" variant="subtle" onClick={onRefreshStatus}>
            Refresh status
          </Button>
        </Group>

        {status && (
          <Text size="xs" c="dimmed">
            Interval: {status.intervalMs} ms · Pending:{" "}
            {status.pendingIntervalsInRow} / {status.maxPendingIntervals}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
