import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import PersonalPage from "./pages/PersonalPage";
import AdminUpdatesPage from "./pages/AdminUpdatesPage";

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f7" }}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/updates" element={<AdminUpdatesPage />} /> {/* admin page */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
