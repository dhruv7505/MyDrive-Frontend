import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TrashView() {
    const [trashFiles, setTrashFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch trashed files from backend
    const fetchTrashFiles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/files/trash`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrashFiles(res.data);
        } catch (err) {
            console.error("Failed to fetch trash files:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrashFiles();
    }, []);

    // Restore a trashed file
    const restoreFile = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/files/${id}/restore`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTrashFiles(); // Refresh list
        } catch (err) {
            console.error("Failed to restore file:", err);
        }
    };

    // Permanently delete a file
    const deleteFilePermanently = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/files/${id}/permanent`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTrashFiles(); // Refresh list
        } catch (err) {
            console.error("Failed to delete file:", err);
        }
    };

    if (loading) return <div className="text-gray-500">Loading trash...</div>;

    if (!trashFiles.length)
        return <div className="text-gray-500 text-center py-8">Trash is empty</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Trash</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {trashFiles.map((file) => (
                    <div key={file.id} className="p-4 bg-gray-100 rounded shadow">
                        <div className="font-semibold text-center">{file.name}</div>
                        <div className="text-gray-500 text-sm text-center">
                            {file.mime_type}
                        </div>
                        <div className="mt-2 flex justify-center gap-2">
                            <button
                                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                onClick={() => restoreFile(file.id)}
                            >
                                Restore
                            </button>
                            <button
                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                onClick={() => deleteFilePermanently(file.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
