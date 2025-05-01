"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UploadCloud, Sparkles, Clock } from "lucide-react";
import { redirect } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const handlecreate = () => {
  redirect("/register");
};

export default function Home() {
  const headerRef = useRef(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const lowerSectionsRef = useRef([]);

  useEffect(() => {
   
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

   
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" }
    );

    
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }
    );

    
    lowerSectionsRef.current.forEach((section, index) => {
      if (index !== 1) {
      
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%", 
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-900 flex flex-col">
      <header
        ref={headerRef}
        className="text-center py-20 bg-black text-white"
      >
        <h1 className="text-5xl font-bold mb-4">Enhance Your Images With Our Help</h1>
        <p className="text-lg mb-6">
          Upscale and restore image quality effortlessly with Real-ESRGAN.
        </p>
        <label className="cursor-pointer bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200">
          <button onClick={handlecreate}>
            <UploadCloud className="inline-block mr-2" /> Don't Have an account{" "}
            <strong>Create </strong> one now
          </button>
        </label>
      </header>

      <section
        ref={sectionRef}
        className="max-w-4xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8 text-center"
      >
        <div
          ref={(el) => (cardsRef.current[0] = el)}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <Sparkles className="mx-auto text-blue-500" size={40} />
          <h2 className="font-semibold text-xl mt-4">Model Based</h2>
          <p className="text-gray-600 mt-2">
            Enhance images with cutting-edge ML model.
          </p>
        </div>
        <div
          ref={(el) => (cardsRef.current[1] = el)}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <Clock className="mx-auto text-blue-500" size={40} />
          <h2 className="font-semibold text-xl mt-4">Fast Processing</h2>
          <p className="text-gray-600 mt-2">Get high-quality results in seconds.</p>
        </div>
        <div
          ref={(el) => (cardsRef.current[2] = el)}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <Sparkles className="mx-auto text-blue-500" size={40} />
          <h2 className="font-semibold text-xl mt-4">High-Resolution</h2>
          <p className="text-gray-600 mt-2">
            Restore details and upscale images to 4K.
          </p>
        </div>
      </section>

      <section
        ref={(el) => (lowerSectionsRef.current[0] = el)}
        className="text-center py-16 bg-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">1. Upload Your Image</h3>
            <p className="text-gray-600">Select an image you want to enhance.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">2. Let Our Model Work</h3>
            <p className="text-gray-600">
              Our Model enhances your image with precision.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">3. Download & Enjoy</h3>
            <p className="text-gray-600">Get your upscaled image in seconds.</p>
          </div>
        </div>
      </section>

      <footer className="text-center py-12 bg-black text-white mt-auto">
        <h2 className="text-2xl font-semibold">Start Enhancing Your Images Now</h2>
      </footer>
    </div>
  );
}
