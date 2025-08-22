import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Helper to get fresh token each time
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchFiles = async (folderId = null) => {
    const res = await axios.get(
        `${API_URL}/files/list${folderId ? "?folderId=" + folderId : ""}`,
        {
            headers: getAuthHeaders(), // ✅ Get fresh token
        }
    );
    return Array.isArray(res.data) ? res.data : [];
};

export const fetchFolders = async (parentId = null) => {
    const res = await axios.get(`${API_URL}/folders/list`, {
        headers: getAuthHeaders(), // ✅ Get fresh token
    });
    const folders = Array.isArray(res.data) ? res.data : [];
    return folders.filter((f) => f.parent_id === parentId);
};

export const uploadFile = async (file, folderId = null) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folderId", folderId);
    await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
            ...getAuthHeaders(), // ✅ Get fresh token
            "Content-Type": "multipart/form-data",
        },
    });
};

export const createFolder = async (name, parentId = null) => {
    const res = await axios.post(
        `${API_URL}/folders/create`,
        { name, parentId },
        { headers: getAuthHeaders() } // ✅ Get fresh token
    );
    return res.data;
};

export const fetchFileById = async (id) => {
    const res = await fetch(`${API_URL}/files/${id}/download`, {
        headers: getAuthHeaders(), // ✅ Get fresh token
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch file: ${text}`);
    }

    return res.json();
};

export const deleteFile = async (fileId) => {
    const res = await axios.put(
        `${API_URL}/files/${fileId}`,
        {},
        { headers: getAuthHeaders() } // ✅ Get fresh token
    );
    return res.data;
};

export const restoreFile = async (fileId) => {
    const res = await axios.put(
        `${API_URL}/files/${fileId}/restore`,
        {},
        { headers: getAuthHeaders() } // ✅ Get fresh token
    );
    return res.data;
};

export const permanentDeleteFile = async (fileId) => {
    const res = await axios.delete(`${API_URL}/files/${fileId}/permanent`, {
        headers: getAuthHeaders(), // ✅ Get fresh token
    });
    return res.data;
};

export const fetchTrashedFiles = async () => {
    const res = await axios.get(`${API_URL}/files/list?trashed=true`, {
        headers: getAuthHeaders(), // ✅ Get fresh token
    });
    return Array.isArray(res.data) ? res.data : [];
};