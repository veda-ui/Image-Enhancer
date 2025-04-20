"use client";


import BubbleText from "../components/Bubbletext";
import { useState } from "react";
import { upload } from "../../actions/Usercontrolls";

export default function UpscalePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className=" absolute left-2/6 top-1/6 text-4xl">
      <div className="mb-20">
      <div className="group inline-flex space-x-2">
  <span className="hoverText transition-[font-weight,color] duration-350 group-hover:font-black group-hover:text-indigo-100">
    Choose the
  </span>
  <span className="hoverText transition-[font-weight,color] duration-350 group-hover:[&:hover]:font-medium group-hover:[&:hover]:text-indigo-200">
    File
  </span>
  <span className="hoverText transition-[font-weight] duration-350 group-hover:[&:hover]:font-light">
    To upload!!
  </span>
</div>

      </div>
      <form 
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
        <div className="mb-3">
        <input className=" file-input file-input-neutral"  type="file" name="file" required accept="image/*" />
        </div>
        <div className="mb-3 btn btn-neutral">
        <button className="" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload"}
        </button>
        </div>
      </form>

      {error && <p className="alert alert-error">{error}</p>}

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {uploadedImage && (
          <div>
            <h3>Original Image</h3>
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "400px", borderRadius: "8px" }} />
          </div>
        )}

        {upscaledImage && (
          <div>
            <h3>Upscaled Image</h3>
            <img src={upscaledImage} alt="Upscaled" style={{ maxWidth: "400px", borderRadius: "8px" }} />
          </div>
        )}
      </div>
    </div>
  );
}
