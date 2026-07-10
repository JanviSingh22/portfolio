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

// Interests data (18+ items)
const interestsData = [
  {
    id: "painting",
    title: "Painting",
    icon: "🎨",
    description: "Colors on canvas — where structure meets freedom.",
    accentColor: "#C8A96E",
    size: "large"
  },
  {
    id: "sketching",
    title: "Sketching",
    icon: "✏️",
    description: "Quick lines capturing fleeting ideas before they disappear.",
    accentColor: "#8B7355",
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
    id: "writing",
    title: "Writing",
    icon: "✍️",
    description: "Turning thoughts into words, one sentence at a time.",
    accentColor: "#4A7C59",
    size: "medium"
  },
  {
    id: "poetry",
    title: "Poetry",
    icon: "📝",
    description: "Finding rhythm in chaos and meaning in brevity.",
    accentColor: "#9B59B6",
    size: "small"
  },
  {
    id: "cooking",
    title: "Cooking",
    icon: "🍳",
    description: "Experiments in flavor — sometimes successful, always fun.",
    accentColor: "#E67E22",
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
    id: "astronomy",
    title: "Astronomy",
    icon: "🔭",
    description: "Looking up and feeling both small and infinite.",
    accentColor: "#1A237E",
    size: "medium"
  },
  {
    id: "science",
    title: "Science",
    icon: "🔬",
    description: "Asking why, then figuring out how.",
    accentColor: "#00695C",
    size: "small"
  },
  {
    id: "technology",
    title: "Technology",
    icon: "💻",
    description: "Building the future, one line of code at a time.",
    accentColor: "#37474F",
    size: "medium"
  },
  {
    id: "books",
    title: "Books",
    icon: "📚",
    description: "Living a thousand lives through pages.",
    accentColor: "#5D4037",
    size: "large"
  },
  {
    id: "cinema",
    title: "Cinema",
    icon: "🎬",
    description: "Stories told in light, sound, and silence.",
    accentColor: "#B71C1C",
    size: "medium"
  },
  {
    id: "history",
    title: "History",
    icon: "🏛️",
    description: "Understanding where we've been to know where we're going.",
    accentColor: "#795548",
    size: "small"
  },
  {
    id: "nature",
    title: "Nature",
    icon: "🌿",
    description: "The original designer — endlessly inspiring.",
    accentColor: "#2E7D32",
    size: "medium"
  },
  {
    id: "design",
    title: "Design",
    icon: "🎯",
    description: "Making things that work beautifully and look intentional.",
    accentColor: "#F57C00",
    size: "large"
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: "🏗️",
    description: "Where math becomes poetry in three dimensions.",
    accentColor: "#546E7A",
    size: "small"
  },
  {
    id: "travel",
    title: "Travel",
    icon: "✈️",
    description: "New places, new perspectives, new versions of myself.",
    accentColor: "#0277BD",
    size: "medium"
  },
  {
    id: "psychology",
    title: "Psychology",
    icon: "🧠",
    description: "Understanding the mind — mine and everyone else's.",
    accentColor: "#6A1B9A",
    size: "small"
  },
  {
    id: "philosophy",
    title: "Philosophy",
    icon: "💭",
    description: "Questions that have no answers, and that's the point.",
    accentColor: "#3E2723",
    size: "medium"
  }
];


// Coder section data (Opus)
const coderData = {
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Your University Name",
      year: "2022 – 2026",
      description: "Focused on software engineering, data structures, and web technologies."
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
    technical: [
      { name: "Python", level: "advanced" },
      { name: "JavaScript", level: "intermediate" },
      { name: "HTML/CSS", level: "advanced" },
      { name: "SQL", level: "intermediate" },
      { name: "React", level: "beginner" },
      { name: "Node.js", level: "beginner" },
      { name: "Git", level: "intermediate" },
      { name: "Data Analysis", level: "intermediate" }
    ],
    nonTechnical: [
      { name: "Communication" },
      { name: "Problem Solving" },
      { name: "Creativity" },
      { name: "Team Collaboration" },
      { name: "Time Management" },
      { name: "Adaptability" }
    ]
  },
  projects: [
    {
      id: "project-1",
      title: "Portfolio Redesign",
      description: "A personality-driven portfolio built with vanilla JS, CSS custom properties, and scroll-driven animations.",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "https://github.com/JanviSingh22",
      image: null
    },
    {
      id: "project-2",
      title: "Data Visualizer",
      description: "An interactive data visualization tool built with Python for exploring datasets and generating insights.",
      tech: ["Python", "Pandas", "Matplotlib"],
      link: "https://github.com/JanviSingh22",
      image: null
    },
    {
      id: "project-3",
      title: "Task Tracker",
      description: "A minimal task management app with local storage persistence and clean UI.",
      tech: ["JavaScript", "HTML", "CSS"],
      link: "https://github.com/JanviSingh22",
      image: null
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
