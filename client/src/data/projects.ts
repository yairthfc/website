export type Project = {
  id: string;
  title: string;
  area: string;
  /** One sentence shown on cards. */
  summary: string;
  stack: string[];
  /** What the project is and why it is hard. */
  overview: string[];
  /** How it works: concrete engineering points. */
  approach: string[];
  /** What it achieved. Facts only. */
  outcome?: string;
  github: string;
  status?: string;
};

export const featured: Project[] = [
  {
    id: "kaminsky-dns-attack",
    title: "Kaminsky DNS Cache Poisoning",
    area: "Network security",
    summary:
      "I poisoned a BIND9 resolver's cache by racing its real answers with thousands of forged ones. Written in C, both the attacker and the fake name server.",
    stack: ["C", "libpcap", "ldns", "Raw sockets", "Docker"],
    overview: [
      "The Kaminsky attack gets a DNS resolver to cache a forged record, even if the real one is already cached. The trick is to ask about random subdomains that can't be in the cache yet, and answer faster than the real server does.",
      "I wrote both sides: an authoritative name server and an attacker client. Then I ran them against a BIND9 resolver inside a Docker lab network.",
    ],
    approach: [
      "The client asks for random subdomains (ww1.target, ww2.target, ...), so every round is a guaranteed cache miss.",
      "My authoritative server sees which source port the resolver picked and passes it to the client over a TCP side-channel.",
      "The client uses libpcap and ldns to build and send thousands of spoofed UDP replies per round, pretending to be the root server.",
      "Each forged reply carries NS and glue records that hand the target domain to an IP I control.",
      "SO_REUSEADDR and SO_REUSEPORT keep the sockets up under that much traffic.",
    ],
    outcome:
      "The resolver cached the forged delegation, and the target domain started resolving to my IP (6.6.6.6).",
    github: "https://github.com/yairthfc/Kaminsky-DNS-Cache-Poisoning-Attack",
  },
  {
    id: "uthreads",
    title: "User-Level Threads Library",
    area: "Systems programming",
    summary:
      "A preemptive threads library in C++. Round-robin scheduling on a virtual timer, sleeping, blocking and context switching, all in user space.",
    stack: ["C++", "Linux signals", "setitimer", "Scheduling"],
    overview: [
      "The kernel doesn't know these threads exist. They all run inside one process, and my library decides who runs and when. I built it to see what threading libraries actually do under the hood.",
    ],
    approach: [
      "A clean API (uthread_spawn, uthread_block, uthread_sleep and friends) for creating, blocking, resuming, sleeping and terminating threads.",
      "Preemptive round-robin scheduling: setitimer fires SIGVTALRM at the end of each time slice, and the handler switches to the next thread in the ready queue.",
      "A time-indexed structure tracks sleeping threads and wakes them at the right time.",
      "Thread IDs are reused through a min-heap, so the lowest free ID is always handed out first.",
      "Validated with integrated test suites.",
    ],
    github:
      "https://github.com/yairthfc/System_Level_Computing_Projects/tree/main/User-Level-Thread-Management-Library",
  },
  {
    id: "mapreduce-framework",
    title: "Multithreaded MapReduce Framework",
    area: "Concurrency",
    summary:
      "A MapReduce framework in C++ on raw pthreads. You plug in map and reduce, and it runs Map, Sort, Shuffle and Reduce across worker threads without races.",
    stack: ["C++", "pthreads", "Mutexes", "Semaphores", "Atomics"],
    overview: [
      "The framework does the parallel part of MapReduce, so a client only writes map() and reduce(). It's built on low-level POSIX primitives, without C++11 threads.",
    ],
    approach: [
      "A configurable number of worker threads run the map phase in parallel. Each one writes to its own thread-local buffer, so outputs never collide.",
      "A barrier separates the phases, so every thread finishes sorting before the shuffle starts.",
      "The shuffle runs in a single thread for correctness, merging the sorted vectors by their largest key.",
      "Reduce output goes into the shared output vector under a mutex.",
      "A single 64-bit atomic packs the current phase and its progress, so clients can check job state without taking a lock.",
      "Several jobs can run at the same time, each with its own threads.",
    ],
    github: "https://github.com/yairthfc/System_Level_Computing_Projects/tree/main/mapreduce-framework",
  },
  {
    id: "internsheep",
    title: "InternSheep",
    area: "Backend / data",
    summary:
      "A job aggregation engine that pulls student and junior listings from several job boards and turns them into a clean daily CSV.",
    stack: ["Python", "API integration", "Scraping", "Multithreading", "Caching"],
    overview: [
      "I was checking job boards every day and copying internships into a spreadsheet by hand. InternSheep does it for me. It collects listings from sites like RemoteOK, WeWorkRemotely and Goozali, filters them, and exports what's relevant.",
    ],
    approach: [
      "Collects listings through each site's API where there is one, and dynamic scraping where there isn't.",
      "Tag-based filtering (student, software, intern, ...) picks out relevant roles, then normalizes them into one format.",
      "An in-memory cache of previous queries stops repeated API calls. Together with multithreading it cuts total crawl time a lot.",
      "Built so a new job source is easy to plug in, with room for alerts and scheduled runs later.",
    ],
    outcome: "Produces a structured CSV of relevant listings every day.",
    github: "https://github.com/yairthfc/Job-Scanner",
  },
  {
    id: "vm-manager",
    title: "Hierarchical Virtual Memory Manager",
    area: "Operating systems",
    summary:
      "Virtual memory with multi-level page tables, demand paging and its own eviction policy. Not a single malloc in the whole thing.",
    stack: ["C++", "Page tables", "Paging", "Eviction"],
    overview: [
      "This simulates what an OS does when a program touches memory: walk the page tables, handle the page fault, and pick a page to throw out when RAM is full.",
      "The catch is that dynamic allocation isn't allowed. Every structure lives inside a fixed block of simulated physical memory and is reached by index.",
    ],
    approach: [
      "Virtual addresses are translated by walking a tree of page tables, one level at a time.",
      "On a page fault it grabs a free frame, or evicts one if memory is full.",
      "A DFS over the table tree finds free frames and good eviction candidates.",
      "Eviction uses a cyclical-distance metric that behaves roughly like LRU.",
    ],
    github:
      "https://github.com/yairthfc/System_Level_Computing_Projects/tree/main/Virtual-Memory-Management-System",
  },
  {
    id: "buffer-overflow-attack",
    title: "x64 Stack Buffer Overflow Exploit",
    area: "Exploit development",
    summary:
      "Takes over a remote Linux TCP server by overwriting its return address and jumping into shellcode I wrote by hand.",
    stack: ["C", "x64 assembly", "Linux syscalls", "TCP sockets", "GDB"],
    overview: [
      "The target is an x64 Linux server with a stack overflow bug. The exploit connects, uses a leaked stack address to work out where everything sits, and sends a payload that redirects execution.",
    ],
    approach: [
      "The payload is built at runtime: NOP-sled padding, the computed return address, then the shellcode.",
      "The distance from the buffer to the saved RIP is calculated exactly, so the overwrite lands where it should.",
      "The shellcode is hand-written x64 assembly (AT&T syntax). It sets RAX, RDI and RSI and calls execve.",
      "Little-endian conversion and alignment are done by hand so the payload lines up with the stack frame.",
    ],
    outcome:
      "The server returns into the shellcode, which launches the target script through execve.",
    github: "https://github.com/yairthfc/buffer-overflow-attack",
  },
];

export type MinorProject = {
  title: string;
  description: string;
  stack: string;
  github: string;
};

export const otherWork: MinorProject[] = [
  {
    title: "Nanobody 3D structure prediction",
    description: "A 1D ResNet that predicts backbone coordinates from sequence, compared with AlphaFold3.",
    stack: "TensorFlow · Keras",
    github: "https://github.com/yairthfc/nanobody-3d-structure-network",
  },
  {
    title: "Match & importance prediction",
    description: "Hackathon. Predicted match compatibility and trait importance from anonymized profiles.",
    stack: "pandas · scikit-learn",
    github: "https://github.com/yairthfc/ML-Prediction-Project",
  },
  {
    title: "Gradient descent & logistic regression",
    description: "My own GD engine with learning-rate schedules, L1/L2 logistic regression, CV and ROC curves.",
    stack: "NumPy",
    github: "https://github.com/yairthfc/Optamization-and-logistic-regression-project",
  },
  {
    title: "AdaBoost",
    description: "Boosting with hand-built decision stumps, plus plots of decision surfaces and error curves.",
    stack: "NumPy · Plotly",
    github: "https://github.com/yairthfc/ADABOOST-ML-project",
  },
  {
    title: "Perceptron, LDA & Gaussian Naive Bayes",
    description: "Three classic classifiers with a fit/predict interface like scikit-learn's.",
    stack: "NumPy · Plotly",
    github: "https://github.com/yairthfc/ML-Classifiers",
  },
  {
    title: "Linear & polynomial regression",
    description: "Regression from scratch, used to predict house prices and city temperatures.",
    stack: "NumPy · pandas",
    github: "https://github.com/yairthfc/linear-and-polynomial-regression-project",
  },
];
