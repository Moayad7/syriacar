
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TransitionWrapper from '../components/TransitionWrapper';
import { Helmet } from 'react-helmet-async';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  pageTitle,
  pageDescription,
  canonicalUrl,
  ogImage,
  structuredData
}) => {
  const location = useLocation();
  
  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مركز السيارات السوري",
    "url": "https://syrianautohub.com",
    "logo": "https://syrianautohub.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+963 11 123 4567",
      "contactType": "customer service",
      "areaServed": "SY",
      "availableLanguage": "Arabic"
    },
    "sameAs": [
      "https://www.facebook.com/syrianautohub",
      "https://www.instagram.com/syrianautohub",
      "https://twitter.com/syrianautohub"
    ]
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Schema.org structured data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData || defaultStructuredData)}
        </script>
        
        {pageTitle && <title>{pageTitle}</title>}
        {pageDescription && <meta name="description" content={pageDescription} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {pageTitle && <meta property="og:title" content={pageTitle} />}
        {pageDescription && <meta property="og:description" content={pageDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
      </Helmet>
      
      <Navbar />
      <TransitionWrapper>
        <main className="flex-grow">
          {children}
        </main>
      </TransitionWrapper>
      <Footer />
    </div>
  );
};

export default MainLayout;
