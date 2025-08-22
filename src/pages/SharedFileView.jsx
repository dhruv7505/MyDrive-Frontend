import React, { useEffect, useState } from "react";
import { fetchFileById } from "../api/files";


export default function SharedFileView() {
    const [file, setFile] = useState(null);
    const fileId = window.location.pathname.split("/").pop();

    useEffect(() => {
        const loadFile = async () => {
            const f = await fetchFileById(fileId); // get file details from backend
            setFile(f);
        };
        loadFile();
    }, [fileId]);

    if (!file) return <div>Loading file...</div>;

    return (
        <div className="p-6">
            <h2 className="font-bold text-lg">{file.name}</h2>
            <a href={file.download_url} target="_blank" rel="noopener noreferrer">
                Download / Open File
            </a>
        </div>
    );
}
