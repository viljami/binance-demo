const initialState = {
    listenKey: '',
    accountBalances: [],
};

export const SET_LISTEN_KEY = 'LISTEN_KEY::SET';
export const SET_ACCOUNT_BALANCES = 'ACCOUNT_BALANCES::SET';
export const UPDATE_BALANCE = 'BALANCE::UPDATE';

export const setListenKey = listenKey => ({
    type: SET_LISTEN_KEY,
    payload: listenKey
});

export const setAccountBalances = payload => ({
    type: SET_ACCOUNT_BALANCES,
    payload
});

export const updateBalance = payload => ({
    type: UPDATE_BALANCE,
    payload
});

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_LISTEN_KEY:
            return {
                ...state,
                listenKey: payload
            };

        case SET_ACCOUNT_BALANCES:
            return {
                ...state,
                accountBalances: payload
            };

        case UPDATE_BALANCE:
            switch (payload.e) {
                case 'outboundAccountPosition':
                    return {
                        ...state,
                        accountBalances: state.map(a => {
                            const found = payload.B.find(b => b.a === a.asset);
                            if (found) {
                                return ({
                                    asset: found.a,
                                    free: found.f,
                                    lock: found.l
                                });
                            }
                        }),
                    };
                // --- Deprecated ---
                // case 'outboundAccountInfo':
                //     return {
                //         ...state,
                //         accountBalances: payload.B.map(a => ({
                //             asset: a.a,
                //             free: a.f,
                //             lock: a.l,
                //         })),
                //     };
                case 'balanceUpdate':
                    return {
                        ...state,
                        accountBalances: state.map(a =>
                            a.asset === payload.a ?
                                { ...a, free: a.free + payload.d } :
                                a
                        ),
                    };

                default:
                    return state;
            }

        default:
            return state;
    }
};
