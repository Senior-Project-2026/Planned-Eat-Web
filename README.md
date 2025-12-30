# 🥗 Planned-Eat Web

Modern, responsive, and animated landing page for the **Planned-Eat** mobile application. Developed as a university graduation project.

![Project Preview](./assets/images/project-preview.png)

## 🚀 About The Project

This project is a single-page application (SPA) landing page designed to showcase the features, screenshots, and the development team of the Planned-Eat app. Built with React Native Web technology, it offers a near-native experience on both web browsers and mobile devices.

### ✨ Key Features

- **Modern UI/UX**: Fixed header with Glassmorphism effect, clean design, and spacious layout.
- **Micro-Interactions**: Hover effects, button animations, and interactive cards.
- **Scroll Reveal**: Sections fade in and slide up as you scroll down the page.
- **Responsive Design**: Flexible structure compatible with desktop, tablet, and mobile.
- **Dynamic Content**: Content structure managed from a single data file (`constants/data.ts`).

## 🛠️ Technologies

- **Core**: [React Native](https://reactnative.dev/), [React Native Web](https://necolas.github.io/react-native-web/)
- **Framework**: [Expo](https://expo.dev/), [Expo Router](https://docs.expo.dev/router/introduction/)
- **Animation**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Styling**: StyleSheet API (CSS-in-JS)
- **Language**: TypeScript

## 📂 Project Structure

```
Planned-Eat-Web/
├── app/                    # Page and Route structures
│   ├── index.tsx           # Main Landing Page
│   └── _layout.tsx         # Root Layout
├── components/
│   └── landing/            # Landing page components
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       ├── MediaGallerySection.tsx
│       ├── TeamSection.tsx
│       ├── Header.tsx      # Sticky Glassmorphism Header
│       └── ...
├── constants/
│   ├── data.ts             # All text, image, and link data
│   └── theme.ts            # Color palette and theme settings
└── ...
```

## 🏁 Installation and Setup

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/username/planned-eat-web.git
    cd planned-eat-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the web server:**
    ```bash
    npm run web
    ```
    Open `http://localhost:8081` in your browser.

## 📝 Content Editing

You don't need to change the code to update texts, images, or team members on the site. Simply edit the `constants/data.ts` file.

```typescript
// Example: constants/data.ts
export const heroContent = {
  title: "Change Title Here",
  // ...
};
```

## 👥 Development Team

This project was developed by the following team as part of a graduation thesis:

- **Yunus Mert Kok** - Full Stack Developer
- **Yusuf Ad** - Mobile Developer
- **Osman Ileri** - UI/UX Designer

## 📄 License

This project is licensed under the MIT License.
