// Client entry point.
// Hooks MantineProvider with custom color palette and renders App.

import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "./styles/theme.css";
import App from "./App";
import '@mantine/core/styles.css';


const theme = createTheme({
  colors: {
    violetcat: [
      "#F7F4FF",
      "#E9D6FF",
      "#D5AEFF",
      "#C496FF",
      "#BB85FF",
      "#A76AFF",
      "#9251FF",
      "#8A4FFF",
      "#6E34D1",
      "#4B1F94",
    ],
    pinkcat: [
      "#FFE5F5",
      "#FFD4F1",
      "#FFC6EB",
      "#FFB4E6",
      "#FFA3E0",
      "#FF8ED9",
      "#FF80D4",
      "#FF6EC7",
      "#DB54AA",
      "#B33C88",
    ],
    bluecat: [
      "#E8F5FF",
      "#D6EEFF",
      "#CDEBFF",
      "#B9E3FF",
      "#AEE0FF",
      "#9AD8FF",
      "#8CD4FF",
      "#7EC9FF",
      "#63AFDB",
      "#3F82AA",
    ],
  },
  primaryColor: "violetcat",
  primaryShade: 6,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
