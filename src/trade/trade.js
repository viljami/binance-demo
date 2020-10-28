import connect from '../stream/index.js';
import request from '../lib/request.js';
import { set24h, update24hTicker } from './reducer.js';

const FEED = 'ticker';

const toLowerCase = a => a.toLowerCase();
const toSymbol = subscription => subscription.split('@')[0];
const getSymbol = ({ symbol }) => symbol;
const toTicker = symbol => `${symbol}@${FEED}`;
const diff = (from, to) =>
    from.reduce((a, b) => to.includes(b) ? a : a.concat(b), []);

const getTrade = async (baseUrl, apiKey) =>
    await request(
        'GET',
        `${baseUrl}/api/v3/ticker/24hr`,
        undefined,
        apiKey
    );

export default async ({ mainnet, apiKey }, store) => {
    const send = await connect(
        `${mainnet.wss}`,
        apiKey,
        (err, data) => {
            if (err) {
                return console.error(err);
            }

            if (data.method === 'LIST_SUBSCRIPTIONS') {
                const { trade } = store.getState();
                const old = data.result.map(toSymbol);
                const current = trade.map(getSymbol).map(toLowerCase);
                const toBeAdded = diff(current, old);
                const toBeRemoved = diff(old, current);

                if (toBeAdded.length) {
                    send({
                        method: 'SUBSCRIBE',
                        params: toBeAdded.map(toTicker)
                    });
                }

                if (toBeRemoved.length) {
                    send({
                        method: 'UNSUBSCRIBE',
                        params: toBeAdded.map(toTicker)
                    });
                }
            }

            if (data.e === '24hrTicker') {
                return store.dispatch(update24hTicker(data));
            }
        }
    );

    try {
        const result = await getTrade(mainnet.https, apiKey);
        store.dispatch(set24h(result.data));
    } catch (e) {
        console.error(e);
    }

    send({ "method": "LIST_SUBSCRIPTIONS" });
};
