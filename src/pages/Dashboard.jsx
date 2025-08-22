import React, { useEffect, useState, useContext } from "react";
import {
    createFolder,
    fetchFiles,
    fetchFolders,
    uploadFile,
    deleteFile
} from "../api/files";
import FileCard from "./FileCard";
import FolderCard from "./FolderCard";
import Breadcrumbs from "./Breadcrumbs";
import ShareModal from "./ShareModal";
import TrashView from "./TrashView";
import { AuthContext } from "../context/AuthContext.jsx";

// Import react-icons
import { FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);

    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [navigationHistory, setNavigationHistory] = useState([]);
    const [sharingFile, setSharingFile] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [currentView, setCurrentView] = useState("dashboard");

    useEffect(() => {
        if (currentView === "dashboard") loadData();
    }, [currentFolder, currentView]);

    const loadData = async () => {
        try {
            setLoading(true);
            const folderId = currentFolder?.id || null;
            const [fData, folData] = await Promise.all([
                fetchFiles(folderId),
                fetchFolders(folderId),
            ]);
            setFiles(fData || []);
            setFolders(folData || []);
        } catch (error) {
            console.error("Error loading data:", error);
            setFiles([]);
            setFolders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            await uploadFile(file, currentFolder?.id || null);
            await loadData();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleFolderClick = (folder) => {
        if (currentFolder) {
            setNavigationHistory((prev) => [...prev, currentFolder]);
        }
        setCurrentFolder(folder);
    };

    const handleBreadcrumbClick = (folder) => {
        setNavigationHistory([]);
        setCurrentFolder(folder);
    };

    const handleBackNavigation = () => {
        if (navigationHistory.length > 0) {
            const previousFolder = navigationHistory[navigationHistory.length - 1];
            setNavigationHistory((prev) => prev.slice(0, -1));
            setCurrentFolder(previousFolder);
        } else {
            setCurrentFolder(null);
        }
    };

    const createNewFolder = async () => {
        const folderName = prompt("Enter folder name:");
        if (!folderName?.trim()) return;
        try {
            await createFolder(folderName, currentFolder?.id || null);
            await loadData();
        } catch (error) {
            console.error("Failed to create folder:", error);
            alert("Failed to create folder");
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/files/${fileId}/download`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Could not download file");
        }
    };

    const filteredFolders = folders.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredFiles = files.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedFolders = [...filteredFolders].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "date") return new Date(b.created_at) - new Date(a.created_at);
        return 0;
    });

    const sortedFiles = [...filteredFiles].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "size") return b.size - a.size;
        if (sortBy === "date") return new Date(b.created_at) - new Date(a.created_at);
        return 0;
    });

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-60 bg-gray-100 p-4 flex flex-col justify-between">
                <div>
                    <h2 className="font-bold text-lg mb-4">My Drive</h2>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full hover:bg-blue-700"
                        onClick={createNewFolder}
                        disabled={currentView !== "dashboard"}
                    >
                        New Folder
                    </button>

                    <div className="space-y-2">
                        <button
                            className={`w-full text-left p-2 rounded hover:bg-gray-200 ${currentView === "dashboard" ? "font-bold" : ""
                                }`}
                            onClick={() => setCurrentView("dashboard")}
                        >
                            Home
                        </button>
                        <div
                            className={`p-2 text-gray-500 cursor-pointer hover:text-gray-800 ${currentView === "trash" ? "font-bold text-black" : ""
                                }`}
                            onClick={() => setCurrentView("trash")}
                        >
                            Trash
                        </div>
                    </div>

                    {(currentFolder || navigationHistory.length > 0) &&
                        currentView === "dashboard" && (
                            <button
                                onClick={handleBackNavigation}
                                className="mt-4 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Back
                            </button>
                        )}
                </div>

                {/* Logout button */}
                <button
                    onClick={logout}
                    className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center"
                >
                    <FaSignOutAlt className="mr-2" /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {currentView === "dashboard" ? (
                    <>
                        <Breadcrumbs
                            folder={currentFolder}
                            onClick={handleBreadcrumbClick}
                        />

                        <div className="flex justify-between mb-4 mt-2">
                            <input
                                type="text"
                                placeholder="Search files and folders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border rounded p-2 w-2/3"
                            />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border rounded p-2"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="size">Sort by Size</option>
                                <option value="date">Sort by Date</option>
                            </select>
                        </div>

                        <div className="my-4">
                            <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 inline-block">
                                {uploading ? "Uploading..." : "Upload File"}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-gray-500">Loading...</div>
                            </div>
                        )}

                        <div className="mb-4 text-sm text-gray-600">
                            Showing:{" "}
                            {currentFolder ? `Folder "${currentFolder.name}"` : "Root folder"}
                            {!loading && (
                                <span className="ml-4">
                                    {folders.length} folders, {files.length} files
                                </span>
                            )}
                        </div>

                        {/* Folders */}
                        {sortedFolders.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                    Folders
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {sortedFolders.map((folder) => (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            onClick={() => handleFolderClick(folder)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files */}
                        {sortedFiles.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                    Files
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {sortedFiles.map((file) => (
                                        <FileCard
                                            key={file.id}
                                            file={file}
                                            onShare={() => setSharingFile(file)}
                                            onDownload={() => handleDownload(file.id, file.name)}
                                            onDelete={async () => {
                                                await deleteFile(file.id);
                                                await loadData();
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && sortedFolders.length === 0 && sortedFiles.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-xl mb-2">📁</div>
                                <div className="text-gray-500">This folder is empty</div>
                                <div className="text-gray-400 text-sm mt-2">
                                    Upload files or create folders to get started
                                </div>
                            </div>
                        )}

                        {sharingFile && (
                            <ShareModal
                                file={sharingFile}
                                onClose={() => setSharingFile(null)}
                            />
                        )}
                    </>
                ) : (
                    <TrashView />
                )}
            </div>
        </div>
    );
}