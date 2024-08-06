'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContents, addNewContent, updateExistingContent, deleteExistingContent } from '../store/contentSlice';
import { initBroadcastChannel, getBroadcastChannel } from '../utils/broadcastChannel';

export function ContentManager() {
    const dispatch = useDispatch();
    const contents = useSelector(state => state.content.contents);
    const { role, user } = useSelector(state => state.session);

    const [selectedFile, setSelectedFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    const fileInputRef = useRef(null);
    const editTextareaRef = useRef(null);

    useEffect(() => {
        dispatch(fetchContents());
        const channel = initBroadcastChannel();

        if (channel) {
            channel.onmessage = (event) => {
                if (event.data.type === 'CONTENT_UPDATED') {
                    dispatch(fetchContents());
                }
            };
        }

        return () => {
            if (channel) {
                channel.close();
            }
        };
    }, [dispatch]);

    useEffect(() => {
        if (editingId && editTextareaRef.current) {
            editTextareaRef.current.focus();
        }
    }, [editingId]);

    async function handleFileUpload(e) {
        e.preventDefault();
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target.result;
            await dispatch(addNewContent({ fileName: selectedFile.name, content, creator: user.role }));
            setSelectedFile(null);
            dispatch(fetchContents());
            broadcastContentUpdate();
            announceUpload(selectedFile.name);
        };
        reader.readAsText(selectedFile);
    }

    async function handleUpdateContent(id) {
        await dispatch(updateExistingContent({ id, content: editingContent, creator: user.role }));
        setEditingId(null);
        setEditingContent('');
        dispatch(fetchContents());
        broadcastContentUpdate();
        announceUpdate();
    }

    async function handleDeleteContent(id) {
        await dispatch(deleteExistingContent(id));
        dispatch(fetchContents());
        broadcastContentUpdate();
        announceDelete();
    }

    function broadcastContentUpdate() {
        const channel = getBroadcastChannel();
        if (channel) {
            channel.postMessage({ type: 'CONTENT_UPDATED' });
        }
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file && file.type === 'text/plain') {
            setSelectedFile(file);
            announceFileSelected(file.name);
        } else {
            alert('Please select a .txt file');
            e.target.value = null;
        }
    }

    const canModify = (content) => content.creator === user.role;

    function announceUpload(fileName) {
        const message = `File ${fileName} has been uploaded successfully.`;
        announceToScreenReader(message);
    }

    function announceUpdate() {
        const message = 'Content has been updated successfully.';
        announceToScreenReader(message);
    }

    function announceDelete() {
        const message = 'Content has been deleted successfully.';
        announceToScreenReader(message);
    }

    function announceFileSelected(fileName) {
        const message = `File ${fileName} has been selected.`;
        announceToScreenReader(message);
    }

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Content Manager ({role})</h1>
            <form onSubmit={handleFileUpload} className="mb-8">
                <div className="flex items-center space-x-4">
                    <label htmlFor="file-upload" className="flex-1">
                        <span className="sr-only">Choose file</span>
                        <input
                            id="file-upload"
                            ref={fileInputRef}
                            type="file"
                            accept=".txt"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
                            aria-describedby="file-upload-help"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={!selectedFile}
                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        aria-label="Upload selected file"
                    >
                        Upload
                    </button>
                </div>
                <p id="file-upload-help" className="mt-1 text-sm text-gray-500">
                    Upload a .txt file (maximum 5MB)
                </p>
            </form>
            <ul className="space-y-6" aria-label="Uploaded content list">
                {contents.map((content) => (
                    <li key={content.id} className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">{content.fileName}</h2>
                        <p className="text-sm text-gray-600 mb-2">Created by: {content.creator}</p>
                        {editingId === content.id && canModify(content) ? (
                            <div className="space-y-4">
                                <label htmlFor={`edit-content-${content.id}`} className="sr-only">Edit content</label>
                                <textarea
                                    id={`edit-content-${content.id}`}
                                    ref={editTextareaRef}
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    rows="10"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={`Edit content for ${content.fileName}`}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleUpdateContent(content.id)}
                                        className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        aria-label={`Save changes for ${content.fileName}`}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        aria-label="Cancel editing"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 mb-4 overflow-x-auto">
                                    {content.content ? content.content.slice(0, 200) : "No content available"}...
                                </pre>
                                {canModify(content) && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(content.id);
                                                setEditingContent(content.content);
                                            }}
                                            className="py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                            aria-label={`Edit ${content.fileName}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteContent(content.id)}
                                            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            aria-label={`Delete ${content.fileName}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}