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
      year: "2022 – 2026"
    },
    {
      degree: "Class 12th",
      institution: "Your School",
      year: "2022"
    },
    {
      degree: "Class 10th",
      institution: "Your School",
      year: "2020"
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
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Native" }
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
