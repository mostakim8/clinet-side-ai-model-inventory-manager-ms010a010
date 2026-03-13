import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider.jsx";
import { toast } from "react-hot-toast";

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AddModel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Floating Label Focus States
  const [modelNameFocused, setModelNameFocused] = useState(false);
  const [frameworkFocused, setFrameworkFocused] = useState(false);
  const [useCaseFocused, setUseCaseFocused] = useState(false);
  const [datasetFocused, setDatasetFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [imageUrlFocused, setImageUrlFocused] = useState(false);

  const handleAddModel = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let token =
      user?.accessToken || (user?.getIdToken ? await user.getIdToken() : null);

    if (!token) {
      toast.error("Authentication required. Please Log in again");
      setIsSubmitting(false);
      return;
    }

    const form = e.target;
    const newModel = {
      modelName: form.modelName.value,
      framework: form.framework.value,
      useCase: form.useCase.value,
      dataset: form.dataset.value,
      description: form.description.value,
      imageUrl: form.imageUrl.value,
      category: form.category.value,
      developerEmail: user?.email,
    };

    try {
      const response = await fetch(`${SERVER_BASE_URL}/models`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newModel),
      });

      if (!response.ok) throw new Error("Failed to add model");

      toast.success("Add Model Successful");
      form.reset();
      navigate("/app/my-models");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tailwind class for label background
  const labelBgClass = " bg-base-100 ";

  return (
    <div className="min-h-screen flex items-center bg-base-200 relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-base-100/70 backdrop-blur-sm">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 font-bold text-primary animate-pulse">
            Model adding ...
          </p>
        </div>
      )}

      <div className="w-full max-w-5xl p-4 rounded-xl bg-base-100 text-base-content shadow-xl border border-base-300 mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary mb-2 mt-6">
          Add New AI Model
        </h2>

        <form
          onSubmit={handleAddModel}
          className="card-body grid grid-cols-1 md:grid-cols-2 gap-8 p-10 mx-auto"
        >
          {/* Helper function to generate floating label input */}
          {/* Model Name */}
          <div className="form-control relative mb-2">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} px-1 ${
                modelNameFocused
                  ? "text-primary -translate-y-1/2 z-10 left-3 text-[11px] rounded"
                  : "text-base-content/70 opacity-80 mt-2 left-3"
              }`}
            >
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              className="input w-full bg-transparent border border-base-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none pt-2"
              onFocus={() => setModelNameFocused(true)}
              onBlur={(e) => setModelNameFocused(e.target.value.trim() !== "")}
              required
            />
          </div>

          {/* Framework */}
          <div className="form-control relative mb-2">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} px-1 ${
                frameworkFocused
                  ? "text-primary -translate-y-1/2 z-10 left-3 text-[11px] rounded"
                  : "text-base-content/70 opacity-80 mt-2 left-3"
              }`}
            >
              Framework
            </label>
            <input
              type="text"
              name="framework"
              className="input w-full bg-transparent border border-base-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none pt-2"
              onFocus={() => setFrameworkFocused(true)}
              onBlur={(e) => setFrameworkFocused(e.target.value.trim() !== "")}
              required
            />
          </div>

          {/* Use Case */}
          <div className="form-control relative mb-2">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} px-1 ${
                useCaseFocused
                  ? "text-primary -translate-y-1/2 z-10 left-3 text-[11px] rounded"
                  : "text-base-content/70 opacity-80 mt-2 left-3"
              }`}
            >
              Use Case
            </label>
            <input
              type="text"
              name="useCase"
              className="input w-full bg-transparent border border-base-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none pt-2"
              onFocus={() => setUseCaseFocused(true)}
              onBlur={(e) => setUseCaseFocused(e.target.value.trim() !== "")}
              required
            />
          </div>

          {/* Dataset */}
          <div className="form-control relative mb-2">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} px-1 ${
                datasetFocused
                  ? "text-primary -translate-y-1/2 z-10 left-3 text-[11px] rounded"
                  : "text-base-content/70 opacity-80 mt-2 left-3"
              }`}
            >
              Dataset
            </label>
            <input
              type="text"
              name="dataset"
              className="input w-full bg-transparent border border-base-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none pt-2"
              onFocus={() => setDatasetFocused(true)}
              onBlur={(e) => setDatasetFocused(e.target.value.trim() !== "")}
              required
            />
          </div>

          {/* Image URL */}
          <div className="form-control relative mb-2">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} px-1 ${
                imageUrlFocused
                  ? "text-primary -translate-y-1/2 z-10 left-3 text-[11px] rounded"
                  : "text-base-content/70 opacity-80 mt-2 left-3"
              }`}
            >
              Image URL (ImgBB Link)
            </label>
            <input
              type="url"
              name="imageUrl"
              className="input w-full bg-transparent border border-base-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none pt-2"
              onFocus={() => setImageUrlFocused(true)}
              onBlur={(e) => setImageUrlFocused(e.target.value.trim() !== "")}
              required
            />
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base-content/70">
                Category
              </span>
            </label>
            <select
              name="category"
              className="select select-bordered bg-base-100 border-base-300 w-full"
              required
            >
              <option value="LLM">Large Language Model (LLM)</option>
              <option value="Image Gen">Image Generation</option>
              <option value="Audio/Speech">Audio/Speech</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2 relative mb-2">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} px-1 ${
                descriptionFocused
                  ? "text-primary -translate-y-1/2 z-10 left-3 text-[11px] rounded"
                  : "text-base-content/70 opacity-80 mt-2 left-3"
              }`}
            >
              Model Description
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered h-32 w-full bg-transparent border-base-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none pt-8"
              onFocus={() => setDescriptionFocused(true)}
              onBlur={(e) =>
                setDescriptionFocused(e.target.value.trim() !== "")
              }
              required
            ></textarea>
          </div>

          <div className="form-control mt-6 md:col-span-2">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Model"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModel;
