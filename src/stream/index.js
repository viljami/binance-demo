/**
 * Module: Stream
 *
 * Connects send message to response.
 * Create new stream.
*/

import createStream, { addMiddleware as addMiddleware_ } from './stream.js';

export const addMiddleware = addMiddleware_;

export default createStream;
