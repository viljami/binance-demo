import getId from '../lib/get-id.js';
import createSocket from './socket.js';

const sockets = [];
const pendingEvents = [];
const middlewares = [];

const call = o => fn => fn(o);

const createSend = ws => data => {
    const id = getId();
    const event = {
        ...data,
        id
    };

    pendingEvents.push({ event, timestamp: Date.now() });

    ws.send(JSON.stringify(event));
};

const wrapHandler = handler => (err, message) => {
    const receiveTime = Date.now();

    if (err) {
        return handler(err, null);
    }

    const data = JSON.parse(message);
    const index = pendingEvents.findIndex(a => a.event.id === data.id);

    if (index === -1) {
        const processedEvent = { ...data, receiveTime };
        middlewares.forEach(call(processedEvent));
        return handler(null, processedEvent);
    }

    const event = pendingEvents[index];
    pendingEvents.splice(index, 1);

    const processedEvent = {
        ...event.event,
        ...data,
        receiveTime,
        sendTime: event.timestamp
    };

    middlewares.forEach(call(processedEvent));
    handler(null, processedEvent);
};

export const addMiddleware = middleware => middlewares.push(middleware);

export default async (url, apiKey, handler) => {
    const ws = await createSocket(url, apiKey, wrapHandler(handler));
    sockets.push(ws);
    return createSend(ws);
};
