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


// Coder section data
const coderData = {
  skills: [
    { name: "Python", category: "languages", level: "advanced" },
    { name: "SQL", category: "languages", level: "intermediate" },
    { name: "JavaScript", category: "languages", level: "intermediate" },
    { name: "HTML/CSS", category: "frontend", level: "advanced" },
    { name: "React", category: "frontend", level: "beginner" },
    { name: "Node.js", category: "backend", level: "beginner" },
    { name: "Git", category: "tools", level: "intermediate" },
    { name: "VS Code", category: "tools", level: "advanced" },
    { name: "Figma", category: "design", level: "intermediate" },
    { name: "Data Analysis", category: "data", level: "intermediate" }
  ],
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
  timeline: [
    {
      year: "2024",
      title: "Deep Dive into Web Development",
      description: "Building interactive projects, exploring frameworks, and refining design sensibility."
    },
    {
      year: "2023",
      title: "Started Coding Journey",
      description: "Learned Python, SQL, and the fundamentals of programming and problem-solving."
    },
    {
      year: "2022",
      title: "Discovered the Intersection",
      description: "Found the sweet spot where creativity meets technology — and never looked back."
    }
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
