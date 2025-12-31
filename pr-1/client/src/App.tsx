// Root application component. Wraps StudentsPage with Layout.

import Layout from "./components/Layout";
import StudentsPage from "./pages/PageStudents";

export default function App() {
  return (
    <Layout>
      <StudentsPage />
    </Layout>
  );
}
