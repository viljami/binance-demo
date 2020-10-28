const initialState = [];

export const SET_24H = '24H::SET';
export const UPDATE_24H_TICKER = '24H_TICKER::UPDATE';

export const set24h = data => ({
    type: SET_24H,
    payload: data
});

export const update24hTicker = ({
    s: symbol,
    v: volume
}) => ({
    type: UPDATE_24H_TICKER,
    payload: {
        symbol,
        volume
    }
});

const byDescendingVolume = (a, b) => b.volume - a.volume;

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_24H:
            return payload
                .sort(byDescendingVolume)
                .slice(0, 10);
        case UPDATE_24H_TICKER:
            return state
                .map(a =>
                    a.symbol == payload.symbol ?
                        { ...a, ...payload } :
                        a
                );
        default:
            return state;
    }
};
