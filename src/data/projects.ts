export type ProjectLinks = {
  live: string;
  github: string;
};

export type Project = {
  /** Stable key used for modal state and anchors. */
  slug: string;
  /** Rendered as "Project 01". Keep the array in display order. */
  index: string;
  title: string;
  /** One-line summary shown on the card. */
  summary: string;
  /** Which side of the practice the project sits on. */
  discipline: 'build' | 'analyze' | 'both';
  year: string;
  role: string;
  tech: string[];
  /** Path inside /public, or a remote host allowed in next.config.mjs. */
  image: string;
  imageAlt: string;
  links: ProjectLinks;
  /** Long-form case study shown in the project modal. */
  detail: {
    overview: string;
    problem: string;
    solution: string;
    features: string[];
    architecture: string;
    challenges: string[];
    results: string[];
    screenshots: { src: string; alt: string; caption: string }[];
  };
};

/**
 * PROJECT DATA
 * ---------------------------------------------------------------------------
 * Content comes from Abhishek's CV. Anything the CV does not state - live URLs,
 * repository links, screenshots, measured outcomes - stays a bracketed
 * placeholder rather than being invented.
 *
 * To add a project: copy one object, fill in the fields, drop screenshots into
 * /public and point `image` at them. No component changes are required.
 */
export const projects: Project[] = [
  {
    slug: 'ai-chatbot-memory',
    index: '01',
    title: 'AI Chatbot - ChatGPT Clone with Memory System',
    summary:
      'A conversational AI assistant that remembers: short-term context in MongoDB, long-term recall through a Pinecone vector database.',
    discipline: 'both',
    year: '2025',
    role: 'Full Stack Developer',
    tech: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Pinecone', 'Gemini AI'],
    image: '',
    imageAlt: 'AI chatbot conversation interface',
    links: {
      live: '[LIVE DEMO URL]',
      github: 'https://github.com/abhisheksingh-7781/Chat-GPT',
    },
    detail: {
      overview:
        'A ChatGPT-style AI chatbot with user login and registration, built end to end. The interesting part is the memory system: the assistant keeps hold of the current conversation and can also reach back into earlier ones.',
      problem:
        'A chat interface wired straight to a model forgets everything the moment the session ends, and loses the thread even within a long conversation. Useful assistance needs both kinds of recall.',
      solution:
        'Two memory layers. Short-term memory stores the running conversation in MongoDB so each reply carries its context. Long-term memory embeds past interactions into a Pinecone vector database, so relevant history can be retrieved and fed back into the prompt.',
      features: [
        'User login and registration',
        'Short-term memory in MongoDB to maintain conversation context',
        'Long-term memory in a Pinecone vector database for storing and retrieving past interactions',
        'Gemini AI API integration for contextual responses',
        'Responsive chat UI in React with Redux state management',
      ],
      architecture:
        'Split into Frontend and Backend in one repository. React and Redux on the client; a Node.js and Express API layer; MongoDB for users and conversation history; Pinecone as the vector store for long-term recall; the Gemini AI API for generation.',
      challenges: [
        'Keeping conversation context coherent across a long session without sending the entire history to the model on every turn.',
        'Deciding what is worth writing to long-term memory, and retrieving the right slice of it at the right moment.',
      ],
      results: [
        '[RESULT OR OUTCOME]',
        '[WHAT YOU LEARNED]',
      ],
      screenshots: [
        { src: '', alt: '[SCREENSHOT ALT TEXT]', caption: '[SCREENSHOT CAPTION]' },
        { src: '', alt: '[SCREENSHOT ALT TEXT]', caption: '[SCREENSHOT CAPTION]' },
      ],
    },
  },
  {
    slug: 'blinkit-clone',
    index: '02',
    title: 'Blinkit Clone - Grocery Delivery Web App',
    summary:
      'A quick-commerce grocery app covering the full path from product listing through cart to order, with a responsive interface on both mobile and desktop.',
    discipline: 'build',
    year: '2025 - 2026',
    role: 'Full Stack Developer',
    tech: ['React', 'Redux', 'Node.js', 'MongoDB'],
    image: '',
    imageAlt: 'Grocery delivery web app interface',
    links: {
      live: '[LIVE DEMO URL]',
      github: 'https://github.com/abhisheksingh-7781/Blinkit',
    },
    detail: {
      overview:
        'A Blinkit-style grocery delivery web application with a modern interface, built to work through the whole commerce flow rather than a single screen of it.',
      problem:
        'Product listing, cart and checkout each look simple alone, but they share state constantly. Getting that to feel instant is where a grocery app is won or lost.',
      solution:
        'Redux holds global state so the cart stays consistent wherever the user is in the app, backed by Node.js APIs for products, users and orders. The layout was designed for phone screens first, where this kind of app is actually used.',
      features: [
        'Product listing and browsing',
        'Cart management',
        'Order flow',
        'Redux global state management for a smooth user experience',
        'Backend APIs for products, users and orders',
        'Responsive UI for mobile and desktop screens',
      ],
      architecture:
        'Split into Frontend and Backend in one repository. React and Redux on the client; Node.js REST APIs for products, users and orders; MongoDB for persistence.',
      challenges: [
        'Keeping cart state consistent across listing, cart and order screens without prop-drilling or duplicated sources of truth.',
      ],
      results: ['[RESULT OR OUTCOME]', '[WHAT YOU LEARNED]'],
      screenshots: [{ src: '', alt: '[SCREENSHOT ALT TEXT]', caption: '[SCREENSHOT CAPTION]' }],
    },
  },
  {
    slug: 'zaptro-storefront',
    index: '03',
    title: 'Zaptro - Electronics E-Commerce Storefront',
    summary:
      'A consumer electronics storefront built during the Job-Ready Hackathon: product browsing, a live cart and a full marketing site, shipped and deployed inside the competition window.',
    discipline: 'build',
    year: '2025',
    role: 'Frontend Developer',
    tech: ['React', 'Vite', 'JavaScript', 'React Router', 'Responsive UI'],
    image: '',
    imageAlt: 'Zaptro electronics storefront homepage',
    links: {
      live: 'https://hackthon-project-gamma.vercel.app',
      github: 'https://github.com/abhisheksingh-7781/Hackthon-Project',
    },
    detail: {
      overview:
        'Zaptro is an electronics storefront built for the Job-Ready Hackathon run by Sheryians Coding School, a frontend-focused competition held in July 2025. It is a complete shop front rather than a single screen: a rotating hero, product browsing, a cart, and About and Contact pages.',
      problem:
        'A hackathon gives you days, not weeks. The challenge was to land a storefront that feels finished, on every screen size, without cutting the parts a real shop needs.',
      solution:
        'A React and Vite single-page app with client-side routing, a persistent cart in the header, and a layout built mobile-first. The supporting content, the trust badges, the footer, the newsletter block, is what makes it read as a real store rather than a demo.',
      features: [
        'Rotating hero carousel on the landing page',
        'Product browsing with a persistent cart counter in the header',
        'Client-side routing across Home, Products, About and Contact',
        'Trust badges for shipping, payment, returns and support',
        'Responsive layout from phone to desktop',
        'Deployed and publicly reachable',
      ],
      architecture:
        'React with Vite as the build tool, client-side routing for navigation, and deployment to Vercel.',
      challenges: [
        'Delivering a storefront that felt complete under hackathon time pressure, which meant deciding early what to build properly and what to leave out.',
      ],
      results: [
        'Shipped a live, publicly deployed storefront within the competition.',
        'Earned a Certificate of Participation from Sheryians Coding School, 26 July 2025.',
      ],
      screenshots: [{ src: '', alt: '[SCREENSHOT ALT TEXT]', caption: '[SCREENSHOT CAPTION]' }],
    },
  },
];
