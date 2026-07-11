/**
 * Content Data — Structured content objects for the portfolio.
 * Separates content from presentation per Requirement 13.
 */

// Profile / About data
const profileData = {
  name: "Janvi Singh",
  tagline: "codegeek version 2004",
  bio: "I'm passionate about the intersection of science and art. A harmonious contradiction — structured yet spontaneous, logical yet imaginative. I believe in building things with intention, exploring ideas with curiosity, and expressing myself through code and creativity.",
  traits: [
    { label: "Structured", description: "I approach problems methodically, breaking complexity into clean, manageable pieces." },
    { label: "Spontaneous", description: "I follow inspiration wherever it leads — a new medium, a random project, a midnight idea." },
    { label: "Curious", description: "Every question is a door. I open as many as I can." },
    { label: "Creative", description: "Code is my canvas. Design is my language. Expression is my constant." }
  ],
  social: {
    github: "https://github.com/JanviSingh22",
    instagram: "#"
  }
};

// Interests data
const interestsData = [
  {
    id: "writing",
    title: "Writing",
    icon: "✍️",
    description: "Turning thoughts into words, one sentence at a time.",
    accentColor: "#4A7C59",
    size: "medium"
  },
  {
    id: "photography",
    title: "Photography",
    icon: "📷",
    description: "Freezing moments that tell their own stories.",
    accentColor: "#2C3E50",
    size: "large"
  },
  {
    id: "reading",
    title: "Reading",
    icon: "📚",
    description: "Living a thousand lives through pages.",
    accentColor: "#5D4037",
    size: "medium"
  },
  {
    id: "music",
    title: "Music",
    icon: "🎵",
    description: "The universal language that needs no translation.",
    accentColor: "#6B5B95",
    size: "large"
  },
  {
    id: "painting",
    title: "Painting",
    icon: "🎨",
    description: "Colors on canvas — where structure meets freedom.",
    accentColor: "#C8A96E",
    size: "large"
  }
];


// Coder section data (Opus)
const coderData = {
  education: [
    {
      degree: "B.Tech, Computer Science",
      institution: "Your University",
      year: "2022 – 2026",
      description: "Pursuing a Bachelor's in Computer Science with focus on algorithms, data structures, and software engineering. Active member of the coding club and hackathon team."
    },
    {
      degree: "Class 12th",
      institution: "Your School",
      year: "2022",
      description: "Completed senior secondary with Science stream (Physics, Chemistry, Mathematics). Scored 92% aggregate."
    },
    {
      degree: "Class 10th",
      institution: "Your School",
      year: "2020",
      description: "Completed secondary education with distinction. First introduction to programming through school's computer science curriculum."
    }
  ],
  experience: [
    {
      year: "2024",
      title: "Web Development Intern",
      company: "Company Name",
      description: "Built interactive web applications, collaborated with design team, improved site performance."
    },
    {
      year: "2023",
      title: "Freelance Developer",
      company: "Self-employed",
      description: "Created websites and tools for small businesses and personal projects."
    }
  ],
  skills: {
    languages: [
      { name: "Python" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "SQL" },
      { name: "HTML" },
      { name: "SCSS" }
    ],
    frameworks: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "GraphQL" }
    ],
    tools: [
      { name: "Git" },
      { name: "MongoDB" },
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Kiro" }
    ],
    nonTechnical: [
      { name: "Problem-Solving" },
      { name: "Decision Making" },
      { name: "Critical & Analytical Thinking" },
      { name: "Communication" },
      { name: "Teamwork" }
    ]
  },
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Native" }
  ],
  projects: [
    {
      id: "project-1",
      title: "Texed",
      description: "A text editor software built with Tkinter, enabling users to create, open, and edit text files. Features essential editing operations like cut, copy, paste, undo, and redo with a user-friendly interface for efficient text manipulation and file management.",
      tech: ["Python", "Tkinter"],
      link: "https://github.com/Codegeek2004/TEXED",
      year: "2022"
    },
    {
      id: "project-2",
      title: "TMDB Movies",
      description: "A web application providing an interactive platform to explore movie information. Features dynamic search and filtering, detailed movie data including summaries, ratings, and images. Optimized for performance and responsiveness with real-time data integration.",
      tech: ["React", "JavaScript", "CSS", "HTML", "TMDB API"],
      link: "https://github.com/Codegeek2004/Cine-Bingelols",
      year: "2023"
    },
    {
      id: "project-3",
      title: "PawScan",
      description: "A web application for comprehensive monitoring of pets and animals. Integrates NFC Chips for real-time health, behavior, and location data. Uses NFC tags to store medical records and owner details. Features GPS tracking for real-time location updates and supports remote access for veterinarians, owners, and researchers.",
      tech: ["HTML", "Tailwind CSS", "JavaScript", "GPS API", "Firebase"],
      link: "https://github.com/Codegeek2004/PawScan---Smart-Animal-Monitoring-System",
      year: "2024"
    },
    {
      id: "project-4",
      title: "Savory Bites",
      description: "A full-stack restaurant web application with online ordering, table reservations, and Stripe payment integration. Features multi-tag menu filtering, user authentication with JWT, shopping cart and wishlist, gift cards, order tracking, and a polished landing page with testimonials and chef recommendations.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Express", "MongoDB", "Stripe", "JWT Auth"],
      link: "https://github.com/JanviSingh22/dining",
      year: "2025"
    }
  ],
  achievements: [
    {
      title: "Hackathon Winner",
      event: "Your Hackathon Name 2024",
      description: "Built a working prototype in 24 hours with a team of 4."
    },
    {
      title: "Certificate in Web Development",
      event: "Platform Name",
      description: "Completed advanced web development coursework."
    }
  ],
  profiles: [
    { name: "GitHub", url: "https://github.com/JanviSingh22", icon: "🐙", stat: "" },
    { name: "LeetCode", url: "https://leetcode.com/", icon: "⚡", stat: "" },
    { name: "Codeforces", url: "https://codeforces.com/", icon: "🏆", stat: "" }
  ]
};

// Easter egg commands
const easterEggCommands = {
  "hello": "Hey there! You found me. Welcome to the secret terminal.",
  "help": "Available commands: hello, about, skills, whoami, exit",
  "whoami": "A curious explorer who likes to poke around websites.",
  "about": "This portfolio was hand-crafted with vanilla JS and a lot of intention.",
  "skills": "HTML, CSS, JavaScript, Python, SQL, Design, and a love for clean code.",
  "exit": "__CLOSE__"
};
