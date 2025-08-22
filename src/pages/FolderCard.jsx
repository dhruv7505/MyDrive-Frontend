import React from "react";

export default function FolderCard({ folder, onClick }) {
    return (
        <div
            className="p-4 bg-yellow-100 rounded cursor-pointer hover:bg-yellow-200"
            onClick={onClick}
        >
            <div className="text-center font-semibold">{folder.name}</div>
            <div className="text-center text-gray-500 text-sm">Folder</div>
        </div>
    );
}
