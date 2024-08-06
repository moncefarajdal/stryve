// db.js

import { openDB } from 'idb';
import { encrypt, decrypt } from './encryption';

const DB = 'ContentManagerDB';
const STORE = 'contents';

async function initDB() {
    return openDB(DB, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
                store.createIndex('createdAt', 'createdAt');
            }
        },
    });
}

export async function addContent(fileName, content, creator) {
    const db = await initDB();
    try {
        const encryptedContent = await encrypt(content);
        const result = await db.add(STORE, {
            fileName,
            content: encryptedContent,
            creator,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        console.log('Content added successfully:', result);
        return result;
    } catch (error) {
        console.error('Error adding content:', error);
        throw error;
    }
}

export async function updateContent(id, updatedContent) {
    const db = await initDB();
    const existingContent = await db.get(STORE, id);
    if (!existingContent) {
        throw new Error('Content not found');
    }
    const encryptedContent = await encrypt(updatedContent.content);
    return db.put(STORE, {
        ...existingContent,
        ...updatedContent,
        content: encryptedContent,
        updatedAt: new Date().toISOString(),
    });
}

export async function getAllContents() {
    const db = await initDB();
    try {
        const contents = await db.getAllFromIndex(STORE, 'createdAt');
        const decryptedContents = await Promise.all(contents.map(async (content) => ({
            ...content,
            content: await decrypt(content.content)
        })));
        console.log('Decrypted contents:', decryptedContents);
        return decryptedContents;
    } catch (error) {
        console.error('Error getting all contents:', error);
        throw error;
    }
}

export async function getContent(id) {
    const db = await initDB();
    const content = await db.get(STORE, id);
    if (content) {
        content.content = await decrypt(content.content);
    }
    return content;
}

export async function deleteContent(id) {
    const db = await initDB();
    return db.delete(STORE, id);
}