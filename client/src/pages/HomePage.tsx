import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const slideHeight = "min-h-[calc(100vh-80px)]"; // full viewport minus header

// Small component: arrow + "scroll for more" hint
const ScrollHint = () => (
  <motion.div
    className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center text-xs text-slate-500"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ amount: 0.9 }}
    transition={{ duration: 0.6 }}
  >
    <span className="mb-1">Scroll for more</span>
    <motion.span
      className="text-lg"
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    >
      ↓
    </motion.span>
  </motion.div>
);

function HomePage() {
  // ---------------- PERSONAL PHOTOS SLIDER STATE ----------------
  const personalPhotos = [
    "/personal-1.jpeg",
    "/personal-2.jpeg",
    "/personal-3.jpeg",
    "/personal-4.jpeg",
  ];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () =>
    setCurrentPhotoIndex((prev) => (prev + 1) % personalPhotos.length);

  const prevPhoto = () =>
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + personalPhotos.length) % personalPhotos.length
    );

  // auto-change photo every 4 seconds
  useEffect(() => {
    if (personalPhotos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % personalPhotos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [personalPhotos.length]);

  const currentPhoto = personalPhotos[currentPhotoIndex] ?? "/personal-1.jpeg";

  // ----------------------------------------------------------------

  return (
    <div className="h-[calc(100vh-80px)] snap-y snap-mandatory overflow-y-auto">
      {/* SLIDE 1 – INTRO */}
      <section
        id="intro"
        className={`relative snap-start bg-gradient-to-br from-slate-50 via-sky-50 to-sky-100 ${slideHeight}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center">
          {/* Left: text */}
          <motion.div
            className="flex-1 space-y-7"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Software · Engineering · CS
            </p>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Yair Mahfud{" "}
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-xl leading-relaxed text-slate-700">
              I&apos;m a Software Engineer and 4th-year Computer Science student
              at the Hebrew University of Jerusalem. I&apos;m passionate about
              building reliable systems, solving complex problems, and
              understanding how things work under the hood — from operating
              systems and memory management to full-stack applications and
              backend architecture.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Throughout my degree, I&apos;ve built strong foundations in
              algorithms, data structures, OS & memory models, system
              programming, networking, databases, and software design. I enjoy
              learning new technologies, experimenting with engineering ideas,
              and turning concepts into real, working products.
            </p>

            <div className="mt-4 space-y-2 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Technologies & Skills
              </p>
              <div className="text-xs text-slate-700 md:text-sm">
                <span className="font-semibold">Languages:</span> Python, Java,
                C, C++, SQL, JavaScript
              </div>
              <div className="text-xs text-slate-700 md:text-sm">
                <span className="font-semibold">Frameworks & Tools:</span>{" "}
                Node.js, React, REST APIs, Git, modern frontend & backend
                tooling
              </div>
              <div className="text-xs text-slate-700 md:text-sm">
                <span className="font-semibold">Domains & Skills:</span> data
                structures & algorithms, OS and memory management, concurrency,
                networking, system design, full-stack development
              </div>
            </div>
          </motion.div>

          {/* Right: profile card */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div className="mx-auto max-w-sm rounded-3xl bg-white/90 p-6 shadow-xl shadow-sky-100/80 ring-1 ring-slate-200">
              {/* Banner */}
              <div className="relative z-0 mb-5 h-48 w-full overflow-hidden rounded-2xl bg-slate-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/40 via-slate-900/40 to-sky-300/40" />
              </div>

              {/* Profile image */}
              <div className="relative z-10 -mt-20 mb-5 flex justify-center">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                  <img
                    src="/profile.jpeg"
                    alt="Yair profile"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  Yair Mahfud
                </h2>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-600">
                  Software Engineer · CS Student
                </p>
                <p className="pt-2 text-sm text-slate-600">
                  Always learning, always building — with a focus on strong CS
                  fundamentals and real-world projects.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <ScrollHint />
      </section>

      {/* SLIDE 2 – PROJECTS & ENGINEERING PATH */}
      <motion.section
        id="about"
        className={`relative snap-start bg-slate-50 ${slideHeight}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          {/* header block with "at a glance" card */}
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="md:max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                Engineering journey
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
                My Engineering Path & Projects
              </h2>
              <p className="mt-3 text-sm text-slate-700 md:text-base">
                During my studies at HUJI, I&apos;ve focused on building a
                strong software-engineering mindset grounded in computer science
                fundamentals — writing efficient code, understanding
                system-level behavior, and building reliable, maintainable
                software.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200 md:w-72">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                At a glance
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500">Academic average</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  84
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-600">
                Coursework in advanced programming, algorithms, operating
                systems, computer architecture, databases, and machine learning.
              </p>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {/* InternSheep */}
            <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                  Project
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  InternSheep
                </h3>
                <p className="mt-2 text-sm text-slate-600 md:text-[15px]">
                  A Python-based platform that aggregates job listings from
                  multiple sources, cleans and deduplicates the data, and
                  exports structured results for students and juniors.
                </p>
                <p className="mt-2 text-[11px] font-medium text-sky-600">
                  Python · concurrency · caching · CSV / data pipelines
                </p>
              </div>
              <Link
                to="/projects"
                state={{ openProjectId: "internsheep" }}
                className="mt-5 inline-flex w-fit items-center rounded-full bg-sky-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-600"
              >
                View in projects
              </Link>
            </div>

            {/* User-Level Thread Management Library */}
            <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Project
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  User-Level Thread Management Library
                </h3>
                <p className="mt-2 text-sm text-slate-600 md:text-[15px]">
                  A custom user-level threading library implementing scheduling,
                  synchronization, and efficient context switching as part of a
                  systems programming project.
                </p>
                <p className="mt-2 text-[11px] font-medium text-emerald-600">
                  C / C++ · concurrency · scheduling · OS concepts
                </p>
              </div>
              <Link
                to="/projects"
                state={{ openProjectId: "uthreads" }}
                className="mt-5 inline-flex w-fit items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-600"
              >
                View in projects
              </Link>
            </div>

            {/* VM Management System */}
            <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                  Project
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  Hierarchical Virtual Memory Manager
                </h3>
                <p className="mt-2 text-sm text-slate-600 md:text-[15px]">
                  A C++ virtual memory management system simulating hierarchical
                  page tables, address translation, page faults, swapping, and a
                  custom eviction strategy — all under strict memory constraints
                  and without dynamic allocation.
                </p>
                <p className="mt-2 text-[11px] font-medium text-violet-600">
                  C++ · OS · memory models · page tables · eviction algorithms
                </p>
              </div>
              <Link
                to="/projects"
                state={{ openProjectId: "vm-manager" }}
                className="mt-5 inline-flex w-fit items-center rounded-full bg-violet-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-violet-600"
              >
                View in projects
              </Link>
            </div>

            {/* IML Hackathon */}
            <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                  Project
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  IML Hackathon – ML Prediction
                </h3>
                <p className="mt-2 text-sm text-slate-600 md:text-[15px]">
                  A hackathon project building models to predict match
                  compatibility and importance ratings using anonymized user
                  data, with multiple ML approaches and evaluation.
                </p>
                <p className="mt-2 text-[11px] font-medium text-amber-600">
                  Python · ML models · data preprocessing · model evaluation
                </p>
              </div>
              <Link
                to="/projects"
                state={{ openProjectId: "iml-hackathon" }}
                className="mt-5 inline-flex w-fit items-center rounded-full bg-amber-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-amber-600"
              >
                View in projects
              </Link>
            </div>
            {/* Nanobody 3D Structure Prediction Network */}
            <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  Project
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  Nanobody 3D Structure Prediction
                </h3>
                <p className="mt-2 text-sm text-slate-600 md:text-[15px]">
                  A TensorFlow/Keras model that predicts nanobody backbone coordinates from sequence using 1D ResNet-style convolutions.
                </p>
                <p className="mt-2 text-[11px] font-medium text-indigo-600">
                  Python · TensorFlow · Structural biology
                </p>
              </div>
              <Link
                to="/projects"
                state={{ openProjectId: "nanobody-structure-nn" }} // 👈 important
                className="mt-5 inline-flex w-fit items-center rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-600"
              >
                View in projects
              </Link>
            </div>
          </div>
        </div>

        <ScrollHint />
      </motion.section>

      {/* SLIDE 3 – PERSONAL + PHOTO SLIDER */}
      <motion.section
        id="focus"
        className={`relative snap-start bg-slate-100 ${slideHeight}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 md:flex-row md:items-center">
          {/* Left: text */}
          <div className="md:w-1/2">
            <h2 className="mb-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Beyond Engineering
            </h2>
            <p className="mb-4 text-sm text-slate-700 md:text-base">
              Outside the world of code, I&apos;m someone who loves energy,
              creativity, and ambition. I&apos;m passionate about{" "}
              <span className="font-semibold">entrepreneurship</span> -{" "}
              constantly thinking about ideas, building small things, and
              exploring how technology can improve experiences in work, sports,
              or daily life.
            </p>
            <p className="mb-4 text-sm text-slate-700 md:text-base">
              I&apos;m also currently the{" "}
              <span className="font-semibold">
                Chief Security Officer (CSO) at the Hebrew University of
                Jerusalem
              </span>
              , a role that has taught me responsibility, strategic thinking,
              and leadership.
            </p>
            <p className="mb-6 text-sm text-slate-700 md:text-base">
              Sports are a big part of who I am. I&apos;m a dedicated padel
              player and a Tottenham Hotspur supporter (which requires serious
              emotional resilience 😅). I love the passion and community around
              sports, and I&apos;m always looking for ways to connect these
              interests with technology - whether through ideas, projects, or
              future products.
            </p>
            <p className="text-sm text-slate-700 md:text-base">
              At my core, I&apos;m curious, ambitious, and driven to create
              things that matter - in tech and beyond.
            </p>
            <div className="mt-6">
              <a
                href="/personal"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 transition"
              >
                Explore Personal Page →
              </a>
            </div>

          </div>

          {/* Right: sliding photos */}
          <div className="md:w-1/2">
            <div className="relative mx-auto h-[28rem] max-w-md overflow-hidden rounded-3xl bg-slate-900/5 shadow-md ring-1 ring-slate-200">
              <motion.img
                key={currentPhoto}
                src={currentPhoto}
                alt="Personal"
                className="h-full w-full object-cover"
                initial={{ opacity: 0.2, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* gradient overlay for subtle styling */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />

              {/* controls */}
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-5">
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[18px] text-slate-700 shadow-sm hover:bg-white"
                >
                  ‹
                </button>
                <div className="flex items-center gap-2">
                  {personalPhotos.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        idx === currentPhotoIndex
                          ? "bg-sky-500"
                          : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[18px] text-slate-700 shadow-sm hover:bg-white"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        <ScrollHint />
      </motion.section>

      {/* SLIDE 4 – CONTACT (dark top, light bottom) */}
      <motion.section
        id="contact"
        className={`relative snap-start bg-gradient-to-b from-slate-950 via-slate-950 to-slate-100 ${slideHeight} flex flex-col`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* MAIN CONTENT: centered vertically */}
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="mx-auto max-w-3xl text-center text-slate-50">
            <h2 className="mb-5 -mt-6 text-4xl font-semibold tracking-tight md:mb-6 md:text-5xl">
              Let&apos;s work together.
            </h2>
            <p className="mb-10 mx-auto max-w-xl text-sm text-slate-300 md:text-lg">
              I&apos;m open to software engineering roles, internships,
              collaborations, and interesting projects — especially those
              involving full-stack development, system programming, or
              challenging engineering problems. Whether you have an idea, an
              opportunity, or just want to connect, feel free to reach out.
            </p>

            <div className="mb-8 flex flex-wrap justify-center gap-5">
              <a
                href="mailto:yairthfc@gmail.com"
                className="rounded-full bg-sky-500 px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-sky-600 md:text-base"
              >
                Email me
              </a>
              <a
                href="https://www.linkedin.com/in/yairmahfud"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-600 px-7 py-3 text-sm font-medium text-slate-100 hover:border-sky-400 hover:text-sky-200 md:text-base"
              >
                Connect on LinkedIn
              </a>
              <a
                href="https://github.com/yairthfc"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-600 px-7 py-3 text-sm font-medium text-slate-100 hover:border-sky-400 hover:text-sky-200 md:text-base"
              >
                View my GitHub
              </a>
              <a
                href="/yair-mahfud-resume.pdf"
                download
                className="rounded-full bg-emerald-500 px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 md:text-base"
              >
                Download résumé
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pointer-events-none mb-2 text-center text-[11px] text-slate-400">
          <div>
            Based in Israel · Open to cool projects, internships, and
            collaborations.
          </div>
          <div className="mt-1 text-slate-500">
            © {new Date().getFullYear()} Yair Mahfud
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default HomePage;
