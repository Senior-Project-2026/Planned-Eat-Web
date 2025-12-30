/**
 * Planned-Eat Landing Page Data
 * 
 * This file contains all dynamic content used on the landing page.
 * You can update video links, photos, and team member social media info here.
 */

// Hero Section Content
export const heroContent = {
  title: "Healthy Eating Made Easy",
  subtitle: "Achieve your nutrition goals with personalized meal plans, AI-powered recipe suggestions, and smart shopping lists.",
  appStoreUrl: "#",
  playStoreUrl: "#",
  // Promotion video or image for the app
  heroMediaType: "image" as "video" | "image",
  heroVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  heroImageUrl: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80",
};

// Features
export const features = [
  {
    id: "1",
    icon: "sparkles",
    title: "AI Recipe Suggestions",
    description: "Discover meals that suit your taste with AI-powered personalized recipe recommendations.",
  },
  {
    id: "2",
    icon: "chart-bar",
    title: "Calorie Tracking",
    description: "Easily track your daily calorie intake and reach your nutritional goals.",
  },
  {
    id: "3",
    icon: "shopping-cart",
    title: "Smart Shopping List",
    description: "Save time with shopping lists automatically generated based on your meal plans.",
  },
  {
    id: "4",
    icon: "calendar",
    title: "Weekly Planning",
    description: "Create your weekly meal plans in advance and eat regularly.",
  },
];

// Media Gallery
export const mediaGallery = {
  sectionTitle: "Discover the App",
  promoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  screenshots: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      alt: "Home Page",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80",
      alt: "Recipes",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400&q=80",
      alt: "Calorie Tracking",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
      alt: "Shopping List",
    },
  ],
};

// Team Members
export const teamMembers = [
  {
    id: "1",
    name: "Yusuf Ad",
    role: "Full Stack Developer",
    avatar: require("@/assets/images/team-yusuf.png"),
    linkedIn: "https://www.linkedin.com/in/yusuf-ad",
    github: "https://github.com/yusuf-ad",
  },
  {
    id: "2",
    name: "Yunus Mert Kök",
    role: "Mobile Developer",
    avatar: require("@/assets/images/team-yunus.png"),
    linkedIn: "https://www.linkedin.com/in/yunus-mert-kok",
    github: "https://github.com/YunusKok",
  },
  {
    id: "3",
    name: "Osman İleri",
    role: "UI/UX Designer",
    avatar: require("@/assets/images/team-osman.png"),
    linkedIn: "https://www.linkedin.com/in/osman-ileri-944682299",
    github: "https://github.com/Osmanileri",
  },
];

// Footer Content
export const footerContent = {
  copyright: `© ${new Date().getFullYear()} Planned-Eat. All rights reserved.`,
  tagline: "University Graduation Project",
};

// Site Info
export const siteInfo = {
  name: "Planned-Eat",
  logo: null, // Logo file path can be added
};
