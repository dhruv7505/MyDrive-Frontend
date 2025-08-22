import React, { useState, useEffect } from "react";

export default function Breadcrumbs({ folder, onClick }) {
    const [breadcrumbPath, setBreadcrumbPath] = useState([]);

    useEffect(() => {
        buildBreadcrumbPath(folder);
    }, [folder]);

    const buildBreadcrumbPath = async (currentFolder) => {
        if (!currentFolder) {
            setBreadcrumbPath([]);
            return;
        }

        const path = [];
        let current = currentFolder;

        // Build path from current folder up to root
        while (current) {
            path.unshift(current); // Add to beginning of array

            // If current folder has a parent, fetch it
            if (current.parent_id) {
                try {
                    // You'll need to implement this API call
                    current = await fetchFolderById(current.parent_id);
                } catch (error) {
                    console.error("Error fetching parent folder:", error);
                    break;
                }
            } else {
                current = null; // Reached root
            }
        }

        setBreadcrumbPath(path);
    };

    // Temporary function - replace with your actual API call
    const fetchFolderById = async (id) => {
        // This should call your backend API to get folder by ID
        // For now, return null to prevent infinite loops
        return null;
    };

    const handleBreadcrumbClick = (selectedFolder) => {
        if (onClick) {
            onClick(selectedFolder);
        }
    };

    const handleHomeClick = () => {
        if (onClick) {
            onClick(null); // null represents root/home folder
        }
    };

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded">
            {/* Home/Root folder */}
            <button
                onClick={handleHomeClick}
                className="flex items-center hover:text-blue-600 hover:underline"
            >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                My Drive
            </button>

            {/* Breadcrumb separator and folders */}
            {breadcrumbPath.map((breadcrumbFolder, index) => (
                <React.Fragment key={breadcrumbFolder.id}>
                    {/* Separator */}
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>

                    {/* Folder name */}
                    {index === breadcrumbPath.length - 1 ? (
                        // Current folder (not clickable)
                        <span className="text-gray-900 font-medium">
                            {breadcrumbFolder.name}
                        </span>
                    ) : (
                        // Parent folders (clickable)
                        <button
                            onClick={() => handleBreadcrumbClick(breadcrumbFolder)}
                            className="hover:text-blue-600 hover:underline"
                        >
                            {breadcrumbFolder.name}
                        </button>
                    )}
                </React.Fragment>
            ))}

            {/* Show current path info */}
            {breadcrumbPath.length === 0 && folder === null && (
                <span className="text-gray-500 italic">Root folder</span>
            )}
        </nav>
    );
}