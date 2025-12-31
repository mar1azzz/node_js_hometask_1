//Component to display backup report
import {
  Modal,
  Table,
  Text,
  Group,
  Badge,
  Stack,
} from "@mantine/core";
import type { BackupReport } from "../types/api";

interface Props {
  opened: boolean;
  onClose: () => void;
  report: BackupReport | null;
}

export default function BackupReportModal({ opened, onClose, report }: Props) {
  if (!report) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Backup Report" size="lg">
      <Stack>

        <Group justify="space-between">
          <Text fw={600}>Total backup files:</Text>
          <Badge color="blue">{report.filesCount}</Badge>
        </Group>

        {report.latestBackup && (
          <Group justify="space-between">
            <Text fw={600}>Latest backup:</Text>
            <Text>
              {report.latestBackup.fileName}
              <br />
              <small>{report.latestBackup.createdAt}</small>
            </Text>
          </Group>
        )}

        <Text fw={600}>Students occurrences:</Text>

        <Table withRowBorders highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Student ID</Table.Th>
              <Table.Th>Count</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {report.studentsById.map((s) => (
              <Table.Tr key={s.id}>
                <Table.Td>{s.id}</Table.Td>
                <Table.Td>{s.amount}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="space-between" mt="sm">
          <Text fw={600}>Average students per backup:</Text>
          <Badge color="pink">{report.averageStudents.toFixed(2)}</Badge>
        </Group>
      </Stack>
    </Modal>
  );
}
