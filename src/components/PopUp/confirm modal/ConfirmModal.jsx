import React from 'react';

const ConfirmModal = ({ email, onConfirm, onCancel }) => {
    return (
        <div 
            className="fixed inset-0  bg-opacity-60 z-50 flex items-center justify-center p-4" 
            style={{ zIndex: 9999 }} 
        >
            <div className="bg-base-100 text-base-content p-6 rounded-lg shadow-2xl max-w-sm w-full">
                
                <h3 className="font-bold text-lg ">Are you confirm?</h3>
                

                <div className="flex justify-end gap-3 mt-4">
                    {/* ৩Cancel Button */}
                    <button 
                        className="btn btn-sm btn-outline" 
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    {/* ৪. Confirm Button */}
                    <button 
                        className="btn btn-sm btn-primary" 
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;