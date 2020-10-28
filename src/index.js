import terminalKit from 'terminal-kit';

import createLatency from './latency/index.js';
import createaccount from './account/index.js';
import createTrade from './trade/index.js';
import infoText from './common/info-text.js';
import latencyReducer from './latency/reducer.js';
import accountReducer from './account/reducer.js';
import statusTable from './common/status-table.js';
import tradeReducer from './trade/reducer.js';
import warningText from './common/warning-text.js';
import zip from './lib/zip.js';
import createStore from './common/store.js';

const ensureLength = (a, length) => {
    for (let i = a.length; i < length; i++) {
        a.push(['', '']);
    }

    return a;
};

const { terminal: term } = terminalKit;
const {
    BINANCE_API_KEY,
    BINANCE_SECRET_KEY,
} = process.env;

const apis = {
    apiKey: BINANCE_API_KEY,
    apiSecret: BINANCE_SECRET_KEY,

    testnet: {
        https: 'https://testnet.binance.vision',
        wss: 'wss://testnet.binance.vision/ws',
        stream: 'wss://testnet.binance.vision/stream',
    },

    mainnet: {
        https: 'https://api.binance.com',
        wss: 'wss://stream.binance.com:9443/ws',
        stream: 'wss://stream.binance.com:9443/stream',
    },
};

const initialState = {};
const reducer = (state = initialState, action) => ({
    ...state,
    latency: latencyReducer(state.latency, action),
    account: accountReducer(state.account, action),
    trade: tradeReducer(state.trade, action),
});

const store = createStore(reducer, step);

createLatency(store);
createaccount(apis, store);
createTrade(apis, store);

term.clear();
infoText('Loading...');

function step() {
    const { account, trade, latency } = store.getState();
    const { min, mean, max } = latency;

    term.moveTo(0, 0);

    const accountData = account.accountBalances.length ?
            account.accountBalances
                .filter(a => !!a.free)
                .slice(0, 10)
                .map(({ asset, free }) => [asset, free]) :
            ['Loading...', ''];

    const tradeData = trade.length ?
        trade
            .slice(0, 10)
            .map(a => [a.symbol, a.volume]) :
        ['Loading...', ''];

    statusTable(
        zip(
            ensureLength(accountData, 10),
            ensureLength(tradeData, 10)
        )
        .map(([a, b]) => a.concat(b))
    );

    infoText(
        min < 0 ?
            '\nLatency waiting for data.' :
            `\nLatency ${min} / ${mean} / ${max} ms.`
    );

    warningText("\nTo exit [ Ctrl + c ].");

    term.hideCursor();
};
