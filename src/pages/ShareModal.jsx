import React, { useEffect, useState } from "react";

export default function ShareModal({ file, onClose }) {
    const [shareableLink, setShareableLink] = useState("");

    useEffect(() => {
        if (file) {
            // Use the signed download URL from your file object
            setShareableLink(file.download_url || "");
        }
    }, [file]);

    const handleCopy = () => {
        if (!shareableLink) return;
        navigator.clipboard.writeText(shareableLink);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Share "{file.name}"</h2>
                    <button onClick={onClose} className="text-red-500 font-bold">
                        Close
                    </button>
                </div>

                <div>
                    <input
                        type="text"
                        readOnly
                        value={shareableLink}
                        className="w-full border rounded p-2 mb-2"
                        onClick={(e) => e.target.select()}
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                        disabled={!shareableLink}
                    >
                        Copy Link
                    </button>
                </div>
            </div>
        </div>
    );
}
