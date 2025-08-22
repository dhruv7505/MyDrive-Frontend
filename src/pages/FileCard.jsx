import React from "react";
import { FaShareAlt, FaDownload, FaTrash } from "react-icons/fa";

export default function FileCard({ file, onClick, onShare, onDownload, onDelete }) {
    const openFile = () => {
        if (onClick) {
            onClick();
        } else {
            window.open(file.download_url, "_blank");
        }
    };

    return (
        <div
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col justify-between transition duration-200"
        >
            <div onClick={openFile} className="flex-1">
                <div className="text-center font-semibold truncate">{file.name}</div>
                <div className="text-center text-gray-500 text-sm">{file.mime_type}</div>
                {file.size && (
                    <div className="text-center text-gray-400 text-xs mt-1">
                        {(file.size / 1024).toFixed(2)} KB
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex justify-center gap-4">
                {onShare && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShare();
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Share"
                    >
                        <FaShareAlt size={18} />
                    </button>
                )}
                {onDownload && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload();
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Download"
                    >
                        <FaDownload size={18} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                    >
                        <FaTrash size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
