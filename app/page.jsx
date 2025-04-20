"use client"
import { redirect } from "next/navigation"
import { UploadCloud, Sparkles, Clock } from "lucide-react";


const handlecreate = ()=>{
     redirect("/register");
}



export default function Home() {
  
  return (
    <div className="min-h-screen bg-black text-gray-900">
    
      <header className="text-center py-20 bg-black text-white">
        <h1 className="text-5xl font-bold mb-4">Enhance Your Images With Our Help</h1>
        <p className="text-lg mb-6">Upscale and restore image quality effortlessly with Real-ESRGAN.</p>
        <label className="cursor-pointer bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200">
          <button onClick={handlecreate}>
          <UploadCloud className="inline-block mr-2" /> Don't Have an account <strong>Create </strong> one now 
          </button>
        </label>
      </header>

     
      <section className="max-w-4xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <Sparkles className="mx-auto text-blue-500" size={40} />
          <h2 className="font-semibold text-xl mt-4">Model Based</h2>
          <p className="text-gray-600 mt-2">Enhance images with cutting-edge ML model.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <Clock className="mx-auto text-blue-500" size={40} />
          <h2 className="font-semibold text-xl mt-4">Fast Processing</h2>
          <p className="text-gray-600 mt-2">Get high-quality results in seconds.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <Sparkles className="mx-auto text-blue-500" size={40} />
          <h2 className="font-semibold text-xl mt-4">High-Resolution</h2>
          <p className="text-gray-600 mt-2">Restore details and upscale images to 4K.</p>
        </div>
      </section>

     
      <section className="text-center py-16 bg-gray-200">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">1. Upload Your Image</h3>
            <p className="text-gray-600">Select an image you want to enhance.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">2. Let Our Model Work</h3>
            <p className="text-gray-600">Our Model enhances your image with precision.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">3. Download & Enjoy</h3>
            <p className="text-gray-600">Get your upscaled image in seconds.</p>
          </div>
        </div>
      </section>

    
     
      <footer className="text-center py-12 bg-gray-200">
        <h2 className="text-2xl font-semibold">Start Enhancing Your Images Now</h2>
       
      </footer>


    </div>
  );
}
