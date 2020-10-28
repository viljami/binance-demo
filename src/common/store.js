import { defer } from '../lib/defer.js';

export default (reducer, onUpdate) => {
    let state = reducer(undefined, { type: 'Init', payload: {} });

    const update = () => onUpdate(state);

    return {
        dispatch: action => {
            state = Object.freeze(reducer(state, action));
            defer(update);
        },

        getState() {
            return state;
        }
    };
};
