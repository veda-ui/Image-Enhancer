"use client";

import BubbleText from "../components/Bubbletext";
import { useState } from "react";
import { upload } from "../../actions/Usercontrolls";

export default function UpscalePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = upscaledImage;
    link.download = "upscaled-image.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white mb-4">Image Upscaler</h1>
        <p className="text-lg text-gray-400">
          Upload an image to enhance its quality and download the upscaled version.
        </p>
      </div>

      <form
        className="bg-gray-900 shadow-md rounded-lg p-6 w-full max-w-md"
        action={async (formData) => {
          setError(null);
          setLoading(true);

          const response = await upload({}, formData);
          setLoading(false);

          if (response.success) {
            setUploadedImage(response.imagePath);
            setUpscaledImage(response.upscaledPath);
          } else {
            setError(response.error || "Upload failed.");
          }
        }}
      >
        <div className="mb-4">
          <input
            className="file-input file-input-bordered w-full bg-gray-800 text-white placeholder-gray-500"
            type="file"
            name="file"
            required
            accept="image/*"
          />
        </div>
        <button
          className={`btn w-full ${loading ? "btn-disabled bg-gray-700" : "btn-primary bg-white text-black"}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Completed" : "Upload"}
        </button>
      </form>

      {error && (
        <p className="alert alert-error mt-4 w-full max-w-md text-center text-red-500">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-4xl">
        {uploadedImage && (
          <div className="bg-gray-900 shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-400 mb-4 text-center">
              Original Image
            </h3>
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full rounded-lg border border-gray-700"
            />
          </div>
        )}

        {upscaledImage && (
          <div className="bg-gray-900 shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-400 mb-4 text-center">
              Upscaled Image
            </h3>
            <img
              src={upscaledImage}
              alt="Upscaled"
              className="w-full rounded-lg border border-gray-700"
            />
            <button
              onClick={handleDownload}
              className="btn bg-white text-black w-full mt-4"
            >
              Download Upscaled Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
