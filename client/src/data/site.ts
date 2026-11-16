export const site = {
  name: "Yair Mahfud",
  role: "Backend & DevOps Engineer",
  email: "yairthfc@gmail.com",
  github: "https://github.com/yairthfc",
  linkedin: "https://www.linkedin.com/in/yairmahfud",
  resume: "/yair-mahfud-resume.pdf",
};

export type Job = {
  org: string;
  role: string;
  period: string;
  points: string[];
  tags?: string[];
  current?: boolean;
};

export const experience: Job[] = [
  {
    org: "Check Point",
    role: "DevOps Engineer (student position)",
    period: "Feb 2026 to now",
    current: true,
    points: [
      "I help keep Check Point's cloud security services, WAF-as-a-Service and Cloud Firewall-as-a-Service, reliable in production across multi-region Kubernetes and AWS.",
      "I build, version and publish the container images that get deployed to production clusters.",
      "I lead incident response, root-cause analysis and monitoring for these services.",
      "I build automation, including AI-driven tooling and API integrations, that removes manual ops work and speeds up detection and resolution.",
    ],
    tags: ["AWS", "Kubernetes", "Docker", "Multi-region"],
  },
  {
    org: "The Hebrew University of Jerusalem",
    role: "Chief Security Officer, campus security",
    period: "2023 to 2026",
    points: [
      "Led campus security operations and coordinated the security team.",
      "Handled crisis situations and kept students and staff safe without slowing the campus down.",
    ],
  },
];

export const education = {
  school: "The Hebrew University of Jerusalem",
  degree: "B.Sc. Computer Science",
  period: "2022 to 2026",
  highlights: ["GPA 85", "Dean's List with excellence, 2024/25"],
  grades: [
    { course: "Matrix Multiplication Algorithms", grade: 100 },
    { course: "Software Engineering", grade: 97 },
    { course: "Discrete Mathematics", grade: 97 },
    { course: "Computer Architecture", grade: 94 },
  ],
};

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "C", "C++", "Java", "JavaScript / TypeScript", "SQL"] },
  {
    label: "Cloud & DevOps",
    items: ["AWS", "GCP", "Azure", "Kubernetes", "Docker", "Jenkins", "CI/CD", "Linux scripting"],
  },
  {
    label: "Systems & security",
    items: ["Operating systems", "Concurrency", "Networking", "x64 assembly", "Exploit development"],
  },
  { label: "ML & data", items: ["NumPy", "pandas", "scikit-learn", "TensorFlow / Keras"] },
  { label: "Tools", items: ["Git", "Jira", "Agile", "React", "Node.js"] },
];
