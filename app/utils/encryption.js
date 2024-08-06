// encryption.js

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY is not set in environment variables');
}

// Function to derive a 256-bit key from the provided key
async function deriveKey(keyMaterial) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyMaterial);

    // Use SHA-256 to create a 256-bit hash of the key
    const hash = await crypto.subtle.digest('SHA-256', keyData);

    return crypto.subtle.importKey(
        'raw',
        hash,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encrypt(text) {
    const encodedText = new TextEncoder().encode(text);
    const key = await deriveKey(ENCRYPTION_KEY);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedText
    );

    const encryptedArray = new Uint8Array(encryptedContent);
    const resultArray = new Uint8Array(iv.length + encryptedArray.length);
    resultArray.set(iv, 0);
    resultArray.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode.apply(null, resultArray));
}

async function decrypt(encryptedText) {
    const key = await deriveKey(ENCRYPTION_KEY);

    const encryptedArray = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    const iv = encryptedArray.slice(0, 12);
    const encryptedContent = encryptedArray.slice(12);

    const decryptedContent = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encryptedContent
    );

    return new TextDecoder().decode(decryptedContent);
}

export { encrypt, decrypt };