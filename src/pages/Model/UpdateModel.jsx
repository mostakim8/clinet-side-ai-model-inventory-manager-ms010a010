import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { getAuth } from "firebase/auth";
import { Helmet } from "react-helmet-async";

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateModel = () => {
  const modelToUpdate = useLoaderData();
  const {
    _id,
    modelName,
    description,
    category,
    imageUrl,
    useCase,
    dataset,
    framework,
  } = modelToUpdate || {};

  const { user } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [modelNameFocused, setModelNameFocused] = useState(false);
  const [frameworkFocused, setFrameworkFocused] = useState(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // --- Toast Notification (Top-Right with Animation) ---
  const ToastNotification = () => {
    if (!toast.show) return null;
    return (
      <div className="toast toast-top toast-end z-[100] animate-bounce">
        <div className="alert alert-success shadow-2xl border-2 border-white">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-bold text-white">{toast.message}</span>
          </div>
        </div>
      </div>
    );
  };

  // --- Loading Overlay (Center of the Page) ---
  const LoadingOverlay = () => {
    if (!isSubmitting) return null;
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-300/60 backdrop-blur-sm">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-xl font-bold text-primary animate-pulse">
          Updating...
        </p>
      </div>
    );
  };

  const handleUpdateModel = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const updatedModel = {
      modelName: form.modelName.value,
      description: form.description.value,
      category: form.category.value,
      framework: form.framework.value,
      imageUrl: form.imageUrl.value,
      useCase: useCase,
      dataset: dataset,
    };

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${SERVER_BASE_URL}/models/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedModel),
      });

      if (res.ok) {
        showToast("Save changes", "success");
        setTimeout(() => navigate("/models"), 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 bg-base-200">
      <Helmet>
        <title>Update Model - {modelName}</title>
      </Helmet>

      <ToastNotification />
      <LoadingOverlay />

      <div
        className={`w-full max-w-4xl mx-auto my-10 p-8 bg-base-100 rounded-xl border border-base-300 shadow-2xl transition-all ${isSubmitting ? "blur-sm pointer-events-none" : ""}`}
      >
        <h1 className="text-4xl font-extrabold text-center mb-8 text-primary">
          Edit AI Model
        </h1>

        <form
          onSubmit={handleUpdateModel}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="form-control relative">
            <label
              className={`absolute top-0 font-bold transition-all bg-base-100 ${modelNameFocused || modelName ? "text-secondary -translate-y-1/2 px-1 z-10 left-3 text-[11px]" : "mt-2 left-3"}`}
            >
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              defaultValue={modelName}
              className="input w-full bg-base-200"
              onFocus={() => setModelNameFocused(true)}
              onBlur={(e) => setModelNameFocused(e.target.value !== "")}
              required
            />
          </div>

          <div className="form-control relative">
            <label
              className={`absolute top-0 font-bold transition-all bg-base-100 ${frameworkFocused || framework ? "text-secondary -translate-y-1/2 px-1 z-10 left-3 text-[11px]" : "mt-2 left-3"}`}
            >
              Framework
            </label>
            <input
              type="text"
              name="framework"
              defaultValue={framework}
              className="input w-full bg-base-200"
              onFocus={() => setFrameworkFocused(true)}
              onBlur={(e) => setFrameworkFocused(e.target.value !== "")}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Category</span>
            </label>
            <select
              name="category"
              className="select select-bordered"
              defaultValue={category}
              required
            >
              <option value="LLM">LLM</option>
              <option value="Image Gen">Image Generation</option>
              <option value="Audio/Speech">Audio/Speech</option>
              <option value="Data Analysis">Data Analysis</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Image URL</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              defaultValue={imageUrl}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              name="description"
              defaultValue={description}
              className="textarea textarea-bordered h-32"
              required
            ></textarea>
          </div>

          <div className="form-control mt-6 md:col-span-2">
            <button
              type="submit"
              className="btn btn-secondary w-full font-bold"
            >
              Save Model Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModel;
