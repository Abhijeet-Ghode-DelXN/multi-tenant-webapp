'use client';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
import Testimonials from '../components/home/Testimonials';
import Portfolio from '../components/home/Gallery';
import ContactForm from '../components/home/ContactForm';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';
// import GoogleTranslate from '@/components/GoogleTranslate';

function isMainDomain() {
  if (typeof window === 'undefined') return false;
  const host = window.location.host; // Use host instead of hostname to include port
  const domain = host.split(':')[0]; // Remove port
  
  // Check if it's the superadmin domain
  return domain === 'localhost' || domain === '127.0.0.1' || domain === 'www.landscape360.com' || domain === 'landscape360.com';
}

console.log(isMainDomain());
console.log(process.env.NEXT_PUBLIC_MAIN_DOMAIN);
export default function Home() {
  const [showTenantContent, setShowTenantContent] = useState(undefined);

  useEffect(() => {
    setShowTenantContent(!isMainDomain());
  }, []);

  if (showTenantContent === undefined) {
    // Prevent hydration mismatch: render nothing until client-side check is done
    return null;
  }

  return (
    <>
    {/* <GoogleTranslate /> */}
      <Hero />
      {/* {showTenantContent && <ServicesGrid />}
      {showTenantContent && <Portfolio />} */}
      <ServicesGrid />
     <Portfolio />
      <Testimonials />
      <ContactForm />
      {/* <Footer/> */}
      {!showTenantContent && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <p>Welcome to our platform. Please visit a tenant site to view services and portfolio.</p>
        </div>
      )}
    </>
  );
}
