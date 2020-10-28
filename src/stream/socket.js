import WebSocket from 'ws';

export default (url, apiKey, handler) => {
    const ws = new WebSocket(url, {
        headers: { 'X-MBX-APIKEY': apiKey },
    });

    return new Promise(resolve => {
        ws.on('open', () => resolve(ws));
        ws.on('close', () => handler({ error: 'close' }, null));
        ws.on('error', err => handler(err, null));
        ws.on('message', message => handler(null, message));
    });
};
