// client/src/App.tsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import PersonalPage from "./pages/PersonalPage";
import AdminUpdatesPage from "./pages/AdminUpdatesPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      {/* top padding so content sits below the sticky header */}
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          {/* 🔐 admin route */}
          <Route path="/admin" element={<AdminUpdatesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
