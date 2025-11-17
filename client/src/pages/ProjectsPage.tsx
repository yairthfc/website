import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";


type Project = {
  id: string;
  title: string;
  highlight: string;
  tech: string;
  description: string;
  details?: string[];
  githubUrl?: string;
  status?: string;
  category: string;
  tags: string[];
};

const projects: Project[] = [
  {
    id: "internsheep",
    title: "InternSheep / JobScanner",
    highlight:
      "Job scraping and aggregation tool that turns messy job listings into clean, structured data for students and juniors.",
    tech: "Python · HTTP requests · concurrency · caching · CSV / data pipelines",
    description:
      "InternSheep / JobScanner is a tool I built to automate a problem I kept running into personally: checking multiple job sites for relevant internships and junior roles, and then manually copying everything into a spreadsheet. The project fetches job listings from several sources, normalizes the fields, deduplicates results, and exports a structured dataset that can be filtered, searched, and reused.",
    details: [
      "Pulls job listings from multiple sources and unifies fields such as title, company, location, posting date, and link.",
      "Implements a simple concurrency approach to speed up network-bound operations while staying reliable and debuggable.",
      "Uses caching and lightweight persistence to avoid re-fetching identical results between runs.",
      "Cleans and deduplicates raw data so multiple appearances of the same role across sites are handled gracefully.",
      "Exports a tidy CSV focused on the fields that actually matter for students and juniors, ready to be plugged into other tools.",
    ],
    status: "Actively evolving",
    githubUrl: "https://github.com/yairthfc/Job-Scanner",
    category: "Tools / Data Pipelines",
    tags: ["Python", "Data Pipelines", "Automation", "Scraping"],
  },
  {
    id: "uthreads",
    title: "User-Level Thread Management Library",
    highlight:
      "Custom user-level threading library that implements scheduling, context switching, and basic synchronization.",
    tech: "C / C++ · OS concepts · context switching · scheduling · low-level APIs",
    description:
      "This project is a user-level thread management library written in C/C++ as part of a systems programming course. Instead of relying on OS threads, the library provides its own abstraction on top of a single OS thread. The goal was to deeply understand how threading works underneath higher-level frameworks by building scheduling, switching, and state management from scratch.",
    details: [
      "Implements user-level threads with an API for creating, terminating, and switching between threads.",
      "Maintains internal bookkeeping for thread states (e.g., ready, running, blocked) to support cooperative scheduling.",
      "Uses low-level context manipulation to switch execution between threads in user space.",
      "Supports a configurable number of threads and enforces clear constraints and edge-case handling as required in systems courses.",
      "Designed to be easy to test and reason about, with clear separation between API, scheduler, and internal data structures.",
    ],
    status: "Completed",
    githubUrl:
      "https://github.com/yairthfc/System_Level_Computing_Projects/tree/main/User-Level-Thread-Management-Library",
    category: "Systems Programming",
    tags: ["C / C++", "Threads", "Concurrency", "Scheduling"],
  },
  {
    id: "vm-manager",
    title: "Hierarchical Virtual Memory Management System",
    highlight:
      "Simulated virtual memory manager with hierarchical page tables, page faults, swapping, and a custom eviction strategy.",
    tech: "C++ · virtual memory · hierarchical page tables · replacement algorithms",
    description:
      "This project implements a virtual memory management system in C++ using hierarchical page tables. It simulates how an operating system translates virtual addresses into physical addresses, handles page faults, and decides which pages to evict when memory is full. The entire system operates under strict constraints: no dynamic memory allocation is allowed, and everything must be implemented on top of a statically defined physical memory model.",
    details: [
      "Uses multi-level page tables to translate virtual addresses to physical frames via hierarchical traversal.",
      "Handles page faults on demand by allocating frames or, when memory is full, choosing a victim frame to evict.",
      "Implements page swapping logic and an eviction strategy based on a cyclical distance metric that approximates LRU-like behavior.",
      "Respects a no-heap constraint: all memory is simulated using static arrays and index-based access instead of malloc/new.",
      "Includes a search mechanism (DFS-style traversal) to identify free frames or suitable candidates for eviction within the memory layout.",
      "Designed to closely mirror theoretical OS concepts from the course while still being concrete, testable C++ code.",
    ],
    status: "Completed",
    githubUrl:
      "https://github.com/yairthfc/System_Level_Computing_Projects/tree/main/Virtual-Memory-Management-System",
    category: "Operating Systems",
    tags: ["C+++","OS","Virtual Memory","Page Tables"],
  },
  {
    id: "iml-hackathon",
    title: "IML Hackathon – Match & Importance Prediction",
    highlight:
      "Machine learning models predicting user match compatibility and how much they value traits like ambition and creativity.",
    tech: "Python · pandas · scikit-learn · ML models · evaluation & reporting",
    description:
      "This hackathon project focused on predicting two related targets from anonymized profile data: whether two users are a match, and how much each user values traits like ambition and creativity. The work involved exploring the dataset, building preprocessing pipelines, experimenting with several model families, and evaluating them under time pressure to ship a complete solution with documented results.",
    details: [
      "Explored and profiled the data using Python (pandas) and automated profiling tools to understand distributions and correlations.",
      "Built preprocessing pipelines to handle missing values, encode categorical fields, and prepare features for different models.",
      "Experimented with multiple model types, including decision trees, SVMs, simple neural networks, and baseline classifiers/regressors.",
      "Split the data into train/validation sets and compared models using metrics appropriate for classification and regression.",
      "Generated final prediction files for both subtasks: match classification and importance rating prediction.",
      "Packaged the work with a written report summarizing methodology, design decisions, limitations, and potential improvements.",
    ],
    status: "Hackathon",
    githubUrl: "https://github.com/yairthfc/ML-Prediction-Project",
    category: "Machine Learning",
    tags: ["Python", "ML", "Hackathon", "scikit-learn"],
  },
  {
  id: "nanobody-structure-nn",
  title: "Nanobody 3D Structure Prediction Network",
  highlight:
    "Deep learning model that predicts nanobody backbone and Cβ coordinates directly from sequence using 1D ResNet-style convolutions.",
  tech:
    "Python · TensorFlow / Keras · NumPy · BioPython · scikit-learn",
  description:
    "A neural network that learns to map nanobody amino-acid sequences (one-hot encoded) to 3D backbone and Cβ coordinates, using a ResNet-like 1D convolutional architecture with dilated convolutions, dropout and MSE loss. The model was trained on nearly 2,000 aligned nanobody structures and evaluated on held-out data, with further comparison against AlphaFold3 predictions on a benchmark nanobody.",
  details: [
    "Implements data preprocessing that converts PDB nanobody structures into padded one-hot sequence matrices and coordinate tensors of shape (140, 15), including special handling for glycine CB atoms and padding. ",
    "Uses an architecture with an initial Conv1D, a first ResNet block stack, a second dilated ResNet stack with configurable dilation rates, followed by dropout, an ELU-activated Conv1D, and a Dense projection to 15 output channels (x,y,z for [N, CA, C, O, CB]).",
    "Trained with Adam optimizer and Mean Squared Error (MSE) loss over predicted coordinates, with train/validation split and loss curves tracked to monitor overfitting.",
    "Produces coordinate matrices that can be converted back to PDB files via a custom matrix_to_pdb routine, enabling direct structural visualization and comparison.",
    "Includes an evaluation workflow comparing the model to AlphaFold3 predictions on nanobody 6xw6, including RMSD and visual analysis of CDR loop regions.",
  ],
  status: "Completed",
  githubUrl:
    "https://github.com/yairthfc/nanobody-3d-structure-network",
  category: "Machine Learning / Structural Biology",
  tags: ["Python", "TensorFlow", "Keras", "ML", "Structural Biology"],
  },
];

function ProjectsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState("");

  const location = useLocation() as { state?: { openProjectId?: string } };

  const selectedProject = projects.find((p) => p.id === selectedId) ?? null;

  // 🔗 If navigated from Home with state={ openProjectId: "..." }, open that project automatically
  useEffect(() => {
    const openId = location.state?.openProjectId;
    if (!openId) return;

    const exists = projects.some((p) => p.id === openId);
    if (exists) {
      setSelectedId(openId);
      // optional: scroll to top so the overlay feels centered
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  // Show "back to top" button based on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProject]);

  // Filter projects by search query (title, highlight, tech, tags, category)
  const filteredProjects = projects.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.highlight.toLowerCase().includes(q) ||
      p.tech.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleStayUpdated = async () => {
    if (!email.trim() || !selectedProject) {
      alert("Please enter an email address.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          projectId: selectedProject.id,
        }),
      });

      if (!res.ok) {
        console.error("Subscribe failed", await res.text());
        alert("Something went wrong subscribing. Try again later.");
        return;
      }

      alert(`You’re now subscribed for updates on "${selectedProject.title}".`);
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Network error while subscribing. Is the backend running?");
    }
  };

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-10 text-slate-900">
      {/* Header row with title */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1 text-3xl font-semibold text-slate-900">
            Projects
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            A closer look at some of the engineering projects I&apos;ve worked
            on. Select a project from the list to open a detailed view with more
            context, tech, and structure.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects by name, tech, or topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
      </div>

      {/* List of wide, clickable cards */}
      <div className="space-y-3">
        {filteredProjects.map((project) => {
          const isSelected = project.id === selectedId;
          return (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => setSelectedId(project.id)}
              whileHover={{ y: -2 }}
              className={`flex w-full flex-col items-start rounded-2xl border px-5 py-4 text-left transition-all md:flex-row md:items-center md:justify-between md:px-6 ${
                isSelected
                  ? "border-sky-400 bg-sky-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900 md:text-lg">
                    {project.title}
                  </h2>
                  {/* Project type tag (category) */}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    {project.category}
                  </span>
                  {project.status && (
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-50">
                      {project.status}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-600 md:text-sm">
                  {project.highlight}
                </p>

                {/* Tech badges */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Little indicator */}
              <div className="mt-3 text-xs text-slate-500 md:mt-0 md:ml-3">
                View
              </div>
            </motion.button>
          );
        })}

        {filteredProjects.length === 0 && (
          <p className="text-sm text-slate-500">
            No projects match that search yet.
          </p>
        )}
      </div>

      {/* Overlay: big detail box on top of screen */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* darkened backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
            />

            {/* centered project detail panel */}
            <motion.div
              className="fixed inset-x-4 top-16 z-40 mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 md:inset-x-0"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* Optional progress bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-1 bg-sky-500"
              />

              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
                    {selectedProject.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 md:text-sm">
                    {selectedProject.highlight}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {selectedProject.category && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      {selectedProject.category}
                    </span>
                  )}
                  {selectedProject.status && (
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-50">
                      {selectedProject.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 text-sm text-slate-700 md:px-6 md:py-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Tech & Focus
                </p>
                <p className="mb-4 text-sm font-medium text-sky-700 md:text-[15px]">
                  {selectedProject.tech}
                </p>

                <p className="mb-4 text-sm text-slate-700 md:text-[15px]">
                  {selectedProject.description}
                </p>

                {selectedProject.details && (
                  <ul className="mb-6 list-disc space-y-1.5 pl-5 text-xs text-slate-600 md:text-sm">
                    {selectedProject.details.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}

                {/* Stay updated + footer actions */}
                <div className="mt-2 flex flex-col gap-4 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
                  {/* Stay updated form */}
                  <div className="w-full md:w-2/3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Stay updated on this project
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                      />
                      <button
                        type="button"
                        onClick={handleStayUpdated}
                        className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-700"
                      >
                        Stay updated
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">
                      In a full version, this would subscribe you to major
                      updates for this specific project.
                    </p>
                  </div>

                  {/* GitHub + Close bottom-right */}
                  <div className="flex flex-wrap items-center justify-end gap-3 md:w-1/3">
                    {selectedProject.githubUrl ? (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        View on GitHub
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex cursor-default items-center rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-500"
                      >
                        GitHub link coming soon
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:border-sky-400 hover:text-sky-700"
                      onClick={() => setSelectedId(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Back to top button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-slate-50 shadow-lg hover:bg-slate-800"
          >
            ↑ Back to top
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProjectsPage;
