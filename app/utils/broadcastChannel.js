let channel;

export function initBroadcastChannel() {
    if (typeof window !== 'undefined') {
        channel = new BroadcastChannel('content_sync');
        return channel;
    }
    return null;
}

export function getBroadcastChannel() {
    return channel;
}