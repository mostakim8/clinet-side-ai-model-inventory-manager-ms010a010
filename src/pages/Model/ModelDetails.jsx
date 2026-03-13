import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ModelDetails = () => {
    const { id } = useParams();
    const { user, isLoading: isAuthLoading } = useAuth(); 
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const [model, setModel] = useState(null);
    const [isModelLoading, setIsModelLoading] = useState(true); 
    const [hasPurchased, setHasPurchased] = useState(false); 
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // check purchase
    const checkPurchaseStatus = async (modelId) => {
        const userId = auth.currentUser?.uid; 
        if (!userId) return;
        const purchasesRef = collection(db, `purchase/${userId}/history`);
        try {
            const q = query(purchasesRef, where('modelId', '==', modelId));
            const querySnapshot = await getDocs(q);
            setHasPurchased(!querySnapshot.empty);
        } catch (error) { console.error("Error checking status:", error); }
    };

    useEffect(() => {
        setIsModelLoading(true);
        fetch(`${SERVER_BASE_URL}/models/${id}`)
            .then(res => res.json())
            .then(data => {
                setModel(data);
                if (user) checkPurchaseStatus(data._id);
            })
            .catch(err => console.error("Fetch error:", err))
            .finally(() => setIsModelLoading(false));
    }, [id, user]);

    const handlePurchaseClick = () => {
        if (!user) return navigate('/login');
        if (hasPurchased) return;
        setShowConfirmModal(true);
    };

    const confirmPurchase = async () => {
        setShowConfirmModal(false);
        setIsPurchasing(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${SERVER_BASE_URL}/purchase-model`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    modelId: model._id, 
                    modelName: model.modelName, 
                    buyerEmail: user.email, 
                    developerEmail: model.developerEmail 
                })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Purchase failed");
            }
            setHasPurchased(true);
            setToast({ show: true, message: 'Successfully Purchased!', type: 'success' });
        } catch (err) { 
            setToast({ show: true, message: err.message, type: 'error' }); 
        } finally { setIsPurchasing(false); }
    };

    if (isModelLoading || isAuthLoading) return <div className="flex justify-center items-center min-h-[60vh]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (!model) return <div className="text-center p-10">Model not found.</div>;

    const isOwner = user?.email === model.developerEmail;

    return (
      <div className="container mx-auto p-4 md:p-10 min-h-screen bg-base-200">
        {toast.show && (
          <div className="toast toast-top toast-center z-50">
            <div className={`alert alert-${toast.type} shadow-lg`}>
              <span>{toast.message}</span>
              <button
                onClick={() => setToast({ show: false })}
                className="btn btn-xs btn-ghost"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-10">
            {/* left side : img and developer  */}
            <div className="lg:col-span-1">
              <img
                src={model.imageUrl}
                className="w-full rounded-xl shadow-md mb-6 aspect-video object-cover"
                alt={model.modelName}
              />

              <div className="bg-base-200 p-5 rounded-xl border border-primary/10">
                <h3 className="text-xs font-bold opacity-50 uppercase mb-3">
                  Developer Details
                </h3>
                <div className="flex items-center gap-3">
                  {/* Avatar Section */}
                  <div
                    className={`avatar ${model.developerImage ? "" : "placeholder"}`}
                  >
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      {model.developerImage ? ( <img src={model.developerImage} alt={model.developerName}/>
                      ) : ( <span className="text-xl">{model.developerName?.charAt(0) || "D"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div>
                    <p className="font-bold text-base-content">
                      {model.developerName || "Unknown"}
                    </p>
                    <p className="text-xs opacity-60 truncate w-40">
                      {model.developerEmail}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* right side: models details */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-5xl font-black text-base-content">
                  {model.modelName}
                </h1>
                <div className="badge badge-primary p-3">
                  ID: {model._id.slice(-6)}
                </div>
              </div>

              <p className="text-lg opacity-80 leading-relaxed mb-8">
                {model.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-base-200 rounded-lg border-l-4 border-primary">
                  <span className="text-xs font-bold opacity-50 block mb-1">
                    USE CASE
                  </span>
                  <p className="font-semibold">
                    {model.useCase || "General AI"}
                  </p>
                </div>
                <div className="p-4 bg-base-200 rounded-lg border-l-4 border-secondary">
                  <span className="text-xs font-bold opacity-50 block mb-1">
                    DATASET
                  </span>
                  <p className="font-semibold">
                    {model.dataset || "Proprietary"}
                  </p>
                </div>
                <div className="p-4 bg-base-200 rounded-lg border-l-4 border-accent">
                  <span className="text-xs font-bold opacity-50 block mb-1">
                    FRAMEWORK
                  </span>
                  <p className="font-semibold">
                    {model.framework || model.category}
                  </p>
                </div>
                <div className="p-4 bg-base-200 rounded-lg border-l-4 border-info">
                  <span className="text-xs font-bold opacity-50 block mb-1">
                    TOTAL SALES
                  </span>
                  <p className="font-semibold text-primary">
                    {model.purchased} Units
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePurchaseClick}
                  disabled={hasPurchased || isPurchasing || isOwner}
                  className={`btn btn-lg w-full font-bold shadow-lg ${hasPurchased ? "btn-success text-white" : "btn-primary"}`}
                >
                  {isOwner
                    ? "Owner (Action Disabled)"
                    : hasPurchased
                      ? "✓ You already own this"
                      : isPurchasing
                        ? "Processing..."
                        : "Buy Now"}
                </button>

                {hasPurchased && (
                  <Link
                    to="/app/purchase-history"
                    className="btn btn-link text-center"
                  >
                    Check Purchase History
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* confirmation modal */}
        {showConfirmModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-base-100 shadow-2xl">
              <h3 className="font-bold text-xl mb-4">Finalize Purchase</h3>
              <p className="text-base-content/70">
                Are you sure you want to add <strong>{model.modelName}</strong>{" "}
                to your inventory?
              </p>
              <div className="modal-action">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="btn btn-primary px-8"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};