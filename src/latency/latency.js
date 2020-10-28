import { addMiddleware } from '../stream/index.js';
import { addLatencyCheck } from './reducer.js';

export default store => {
    addMiddleware(data => {
        if (data.E && data.receiveTime) {
            store.dispatch(addLatencyCheck(data.E, data.receiveTime));
        }
    });
};
