const sum = (a, b) => a + b;

const initialState = {
    min: -1,
    max: -1,
    mean: -1,
    values: []
};

const ADD_LATENCY_CHECK = 'LATENCY_CHECK::ADD';

export const addLatencyCheck = (serverTime, receiveTime) => ({
    type: ADD_LATENCY_CHECK,
    payload: receiveTime - serverTime
});

export default (state = initialState, action) => {
    if (action.type !== ADD_LATENCY_CHECK) {
        return state;
    }

    let values = state.values.concat(action.payload);

    if (values.length > 100) {
        values = values.slice(values.length - 100);
    }

    return {
        min: Math.min(...values),
        max: Math.max(...values),
        mean: Math.round(values.reduce(sum, 0) / values.length),
        values,
    };
};
