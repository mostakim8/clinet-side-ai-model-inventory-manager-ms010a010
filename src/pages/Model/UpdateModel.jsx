import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { getAuth } from "firebase/auth";
import { Helmet } from "react-helmet-async";

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateModel = () => {
  const modelToUpdate = useLoaderData();

  // model items (Destructured framework)
  const {
    _id,
    modelName,
    description,
    category,
    imageUrl,
    useCase,
    dataset,
    framework, // 👈 Added framework here
  } = modelToUpdate || {};

  const { user } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [modelNameFocused, setModelNameFocused] = useState(false);
  const [frameworkFocused, setFrameworkFocused] = useState(false); // 👈 Added focus state
  const [imageUrlFocused, setImageUrlFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const ToastNotification = () => {
    if (!toast.show) return null;

    let colorClass = "alert-info";
    if (toast.type === "success") {
      colorClass = "alert-success";
    } else if (toast.type === "error") {
      colorClass = "alert-error";
    }

    return (
      <div className="toast toast-end z-50">
        <div
          className={`alert ${colorClass} transition duration-300 shadow-xl`}
        >
          <span>{toast.message}</span>
        </div>
      </div>
    );
  };

  if (!modelToUpdate) {
    return (
      <div className="text-center py-20 text-xl text-error bg-base-100 min-h-screen">
        Error: Model data could not be loaded.
      </div>
    );
  }

  const handleUpdateModel = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Authentication required.", "error");
      return;
    }

    setIsSubmitting(true);
    const form = e.target;

    const updatedModel = {
      modelName: form.modelName.value,
      description: form.description.value,
      category: form.category.value,
      framework: form.framework.value, // 👈 Capture updated framework
      imageUrl: form.imageUrl.value,
      useCase: useCase,
      dataset: dataset,
    };

    try {
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken();

      const res = await fetch(`${SERVER_BASE_URL}/models/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedModel),
      });

      if (res.ok) {
        // 👈 Updated toast message to "Save changes"
        showToast("Save changes", "success");
        setTimeout(() => navigate("/models"), 1500);
      }
    } catch (error) {
      showToast(`Update Failed: ${error.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelBgClass = " bg-base-100 ";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-base-200">
      <Helmet>
        <title>Update Model - {modelName}</title>
      </Helmet>
      <ToastNotification />

      <div className="w-full max-w-4xl mx-auto my-10 p-8 bg-base-100 text-base-content rounded-xl border border-base-300 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-primary">
          Edit AI Model: <span className="text-secondary">{modelName}</span>
        </h1>

        <form
          onSubmit={handleUpdateModel}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Model Name */}
          <div className="form-control relative">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ${labelBgClass} ${modelNameFocused || modelName ? "text-secondary -translate-y-1/2 px-1 z-10 left-3 text-[11px]" : "text-base-content/70 mt-2 left-3"}`}
            >
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              defaultValue={modelName}
              className="input w-full bg-base-200 border-base-300 pt-4"
              onFocus={() => setModelNameFocused(true)}
              onBlur={(e) => setModelNameFocused(e.target.value !== "")}
              required
            />
          </div>

          {/* Framework 👈 NEW FIELD ADDED */}
          <div className="form-control relative">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ${labelBgClass} ${frameworkFocused || framework ? "text-secondary -translate-y-1/2 px-1 z-10 left-3 text-[11px]" : "text-base-content/70 mt-2 left-3"}`}
            >
              Framework
            </label>
            <input
              type="text"
              name="framework"
              defaultValue={framework}
              className="input w-full bg-base-200 border-base-300 pt-4"
              onFocus={() => setFrameworkFocused(true)}
              onBlur={(e) => setFrameworkFocused(e.target.value !== "")}
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
              className="select select-bordered bg-base-200"
              defaultValue={category}
              required
            >
              <option value="LLM">Large Language Model (LLM)</option>
              <option value="Image Gen">Image Generation</option>
              <option value="Audio/Speech">Audio/Speech</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Image URL */}
          <div className="form-control relative mt-6">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ${labelBgClass} ${imageUrlFocused || imageUrl ? "text-accent -translate-y-1/2 px-1 z-10 left-3 text-[11px]" : "text-base-content/70 pt-4 left-3"}`}
            >
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              defaultValue={imageUrl}
              className="input w-full bg-base-200 border-accent border-2 pt-4"
              onFocus={() => setImageUrlFocused(true)}
              onBlur={(e) => setImageUrlFocused(e.target.value !== "")}
              required
            />
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2 relative">
            <label
              className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ${labelBgClass} ${descriptionFocused || description ? "text-secondary -translate-y-1/2 px-1 z-10 left-3 text-[11px]" : "text-base-content/70 pt-4 left-3"}`}
            >
              Model Description
            </label>
            <textarea
              name="description"
              defaultValue={description}
              className="textarea textarea-bordered h-32 w-full bg-base-200 pt-8"
              onFocus={() => setDescriptionFocused(true)}
              onBlur={(e) => setDescriptionFocused(e.target.value !== "")}
              required
            ></textarea>
          </div>

          {/* Submit Button 👈 Updated Loading state */}
          <div className="form-control mt-6 md:col-span-2">
            <button
              type="submit"
              className="btn btn-secondary w-full text-secondary-content font-bold rounded-xl shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Updating...
                </>
              ) : (
                "Save Model Updates"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModel;
