// Top-level layout wrapper for all pages.

import type { ReactNode } from "react";
import { Card, Container } from "@mantine/core";
import "../styles/theme.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <div className="app-container">
        <Card
          shadow="md"
          radius="lg"
          padding="lg"
          withBorder
          style={{
            background:
              "linear-gradient(135deg, rgba(138,79,255,0.03), rgba(255,110,199,0.03))",
          }}
        >
          <Container size="lg" px="md">
            {children}
          </Container>
        </Card>
      </div>
    </div>
  );
}
