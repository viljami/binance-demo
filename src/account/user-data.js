import connect from '../stream/index.js';
import request from '../lib/request.js';
import { setListenKey, setAccountBalances, updateBalance } from './reducer.js';

const requestUserDataListenKey = (httpBaseUrl, apiKey, apiSecret) =>
    request(
        'POST',
        `${httpBaseUrl}/api/v3/userDataStream`,
        undefined,
        apiKey,
        apiSecret
    );

const keepAlive = (httpBaseUrl, apiKey, apiSecret) =>
    request(
        'PUT',
        `${httpBaseUrl}/api/v3/userDataStream`,
        apiKey,
        apiSecret
    );

const removeListenKey = (httpBaseUrl, listenKey, apiKey, apiSecret) =>
    request(
        'DELETE',
        `${httpBaseUrl}/api/v3/userDataStream`,
        apiKey,
        apiSecret
    );

const requestAccountBalance = (httpBaseUrl, apiKey, apiSecret) =>
    request(
        'GET',
        `${httpBaseUrl}/api/v3/account`,
        {
            timestamp: Date.now()
        },
        apiKey,
        apiSecret
    );

export default async ({ apiKey, apiSecret, testnet }, store) => {
    let listenKey = '';
    let keepAliveInterval = -1;

    try {
        let result = await requestAccountBalance(testnet.https, apiKey, apiSecret);

        if (result.status === 200 && result.data) {
            store.dispatch(setAccountBalances(result.data.balances));
        } else {
            result = await requestAccountBalance(testnet.https, apiKey, apiSecret);
            store.dispatch(setAccountBalances(result.data.balances));
        }
    } catch (e) {
        console.error(e);
    }

    try {
        const result = await requestUserDataListenKey(testnet.https, apiKey, apiSecret);

        if (result.status === 200 && result.data) {
            listenKey = result.data.listenKey;
            store.dispatch(setListenKey(result.data.listenKey));

            keepAliveInterval = setInterval(() =>
                keepAlive(testnet.https, listenKey, apiKey, apiSecret),
                30 * 60 * 1000 // 30 mins
            );
        }
    } catch (e) {
        console.error(e);
    }

    await connect(
        `${testnet.wss}/${listenKey}`,
        apiKey,
        (err, data) => {
            if (err) {
                return console.error(err);
            }

            return store.dispatch(updateBalance(data));
        }
    );

    process.on('beforeExit', () => {
        clearInterval(keepAliveInterval);
        removeListenKey(testnet.https, listenKey, apiKey, apiSecret);
    });
};
