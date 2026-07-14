/**
 * Content Data — Structured content objects for the portfolio.
 * Ordered to match page section flow:
 * Landing → Hero → About Me → Education → Experience → Skills → Projects → Achievements → Interests → Footer
 */

// ============================================
// 1. Profile / About Me data (Hero + About section)
// ============================================
const profileData = {
  name: "Janvi Singh",
  tagline: "codegeek version 2004",
  // Hero
  hero: {
    greeting: "Welcome to my portfolio",
    role: "Software Developer",
    tagline: "Built with logic, inspired by art, driven by curiosity."
  },
  // Nav
  nav: {
    logo: "JS",
    slogan: "Be unstoppable. Be limitless. Be bold."
  },
  // About
  bio: "I'm Janvi — a software developer who builds clean, thoughtful, and engaging digital experiences. I believe good software isn't just functional; it's intuitive, accessible, and visually balanced. Beyond code, I'm drawn to art, design, history, and storytelling — always exploring where creativity and technology meet. Whether I'm refining an interface, chasing a new idea, or solving a problem that matters, curiosity drives everything I do. Every project is a chance to grow, create, and make something people genuinely enjoy.",
  traits: [
    { front: "lore collector", back: "Every rabbit hole is worth it — new tech, old history, weird art, random Wikipedia spirals at 3am." },
    { front: "chaos → structure", back: "I follow midnight ideas wherever they go, then break them into clean, manageable pieces." },
    { front: "pixel perfectionist", back: "The small details that nobody notices? I notice. And I won't ship until they feel right." },
    { front: "builds things", back: "Ideas in, interactive experiences out. Code is just the medium — the art is making it feel alive." }
  ],
  marquee: "codegeek version 2004",
  funFacts: [
    "☕ probably overthinking my next project rn",
    "🌏 silk road trip is on the vision board no cap",
    "🎸 will replay the same song 47 times and still not skip",
    "📰 newspaper girlie in a doomscroll world",
    "😄 small wins hit different, i celebrate everything",
    "🫠 perfection is the enemy but she's kinda valid tho"
  ],
  bouncingTags: [
    { label: "Punk Rock", category: "listening" },
    { label: "Swan Lake", category: "listening" },
    { label: "Instrumental Guitar", category: "listening" },
    { label: "The Hindu", category: "reading" },
    { label: "The Book Thief", category: "reading" },
    { label: "History & Geopolitics", category: "reading" },
    { label: "This Portfolio", category: "building" },
    { label: "Japanese", category: "learning" },
    { label: "Another cup of chai", category: "drinking" },
    { label: "What's the next project?", category: "thinking" }
  ]
};

// ============================================
// 2. Coder section data (Education → Experience → Skills → Projects → Achievements → Profiles)
// ============================================
const coderData = {
  // --- Education ---
  education: [
    {
      title: "Pranveer Singh Institute of Technology",
      subtitle: "B.Tech, Computer Science & Engineering",
      duration: "2021 – 2025"
    },
    {
      title: "Sir Padampat Singhania Education Centre",
      subtitle: "Senior School Certificate Examination",
      duration: "2020 – 2021"
    },
    {
      title: "Fatima Convent School",
      subtitle: "All India Secondary School Examination",
      duration: "2018 – 2019"
    }
  ],

  // --- Experience ---
  experience: [
    {
      company: "Company Name",
      duration: "Aug 2025 – Present",
      role: "Software Developer",
      projects: [
        {
          name: "Metrics Catalogue",
          subtitle: "Control Tower",
          description: [
            "Developed GraphQL resolvers, mutations, and helper utilities using Apollo Server and Sequelize as part of a platform serving 80+ mutations and 60+ queries.",
            "Integrated GraphQL APIs on the React (TypeScript) frontend, connecting UI components to backend services with error handling and Redux state management.",
            "Wrote unit tests using Jest and React Testing Library, contributing to a test suite of 4,900+ cases across the codebase.",
            "Collaborated in a team environment on a multi-tier review/approval workflow with role-based access control.",
            "Worked within a micro-frontend architecture, delivering features across sprints in an Agile setup."
          ],
          tech: ["React 18", "TypeScript", "GraphQL", "SCSS", "Bootstrap 5", "Jest"],
          duration: "Dec 2025 – Present"
        }
      ]
    },
    {
      company: "Infosys",
      duration: "Oct 2024 – Dec 2024",
      role: "Python Stack and Machine Learning Intern",
      projects: [
        {
          name: "Cyberbullying Detection System",
          description: [
            "Led a team of five to develop a Cyberbullying Detection System using a hybrid RNN-LSTM model, overseeing data collection, model experimentation, and performance evaluation.",
            "Scraped comments and curated a balanced dataset (51% negative, 49% positive) from social media platforms like YouTube & Reddit.",
            "Preprocessed and tokenized text, engineered features like word embeddings and TF-IDF for training.",
            "Experimented with traditional models — Random Forest (71.25%), Logistic Regression (70.45%) — comparing performance to advanced neural network techniques.",
            "Designed the front end using HTML, CSS, and Flask, and leveraged NLP techniques to label 46,000 comments, achieving a final model accuracy of 83%."
          ],
          tech: ["Python", "Pandas", "TensorFlow", "Scikit-learn", "NLP", "Flask"],
          link: "https://github.com/Codegeek2004/CyberBullying_Detection",
          duration: "Oct – Dec 2024"
        }
      ]
    }
  ],

  // --- Skills ---
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

  // --- Languages (spoken) ---
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Native" }
  ],

  // --- Projects ---
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

  // --- Achievements ---
  achievements: [
    {
      title: "ACPC Hackathon — Ranked 20th / 350+ Teams",
      event: "ABES Engineering College",
      description: "Led a 3-member team in a collegiate programming contest, competing against 350+ teams."
    },
    {
      title: "Hackathon Participations",
      event: "Flipkart Grid, TCS CodeVita, CodeHers, Smart India Hackathon",
      description: "Participated in national-level coding competitions and hackathons."
    },
    {
      title: "Kanpur Sahodaya Schools Basketball & Chess Tournaments.",
      event: "School Sports",
      description: "Represented school in inter-school basketball tournaments and chess championships."
    }
  ],

  // --- Profiles removed (now in footerData) ---
};

// ============================================
// 3. Interests data (Interests section — after Achievements)
// ============================================
const interestsData = [
  { title: "Writing" },
  { title: "Photography" },
  { title: "Reading" },
  { title: "Music" },
  { title: "Painting" }
];

// ============================================
// 4. Footer data (Contact links)
// ============================================
const footerData = {
  heading: "Get in Touch",
  links: [
    { name: "GitHub", url: "https://github.com/Codegeek2004", iconType: "image", iconSrc: "assets/github.png" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/codegeek2004", iconType: "image", iconSrc: "assets/linkedin.png" },
    // { name: "LeetCode", url: "https://leetcode.com/", iconType: "mss", iconSrc: "code" },
    { name: "Email", url: "mailto:singhjanvi2021@gmail.com", iconType: "mss", iconSrc: "mail" }
  ],
  copyright: "© 2025 Janvi Singh. Built with intention."
};
