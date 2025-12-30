import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// temporary static page during development.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        
        {/* Poppins Font - Like Priot.io */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* SEO */}
        <title>Planned-Eat | AI-Powered Nutrition App</title>
        <meta name="description" content="Personalized meal plans, AI-powered recipe suggestions, and smart shopping lists to help you reach your nutrition goals." />
        
        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nicer, if native scroll performance is acceptable.
        */}
        <ScrollViewStyleReset />
        
        {/* Custom styles for smoother experience */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            font-family: 'Poppins', system-ui, -apple-system, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Selection color */
          ::selection {
            background: rgba(74, 222, 128, 0.3);
            color: inherit;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
