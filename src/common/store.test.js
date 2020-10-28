import { describe, test, assert } from '../lib/test-lib.js';
import createStore from './store.js';

const noop = () => undefined;

describe("Store", () => {
    test("Create", done => {
        const store = createStore(() => ({ a: 1 }), noop);
        assert.deepStrictEqual(store.getState(), { a: 1 }, "Store is initialized.");
        done();
    });

    test("Send action", done => {
        const MY_ACTION = 'MY_ACTION';
        const initialValue = {};
        const rootReducer = (state = initialValue, action) => action.type === MY_ACTION ?
            action.payload :
            state;

        const store = createStore(rootReducer, noop);
        assert.deepStrictEqual(store.getState(), initialValue, "Store is initialized.");

        store.dispatch({ type: MY_ACTION, payload: { a: 1 } });
        assert.deepStrictEqual(store.getState(), { a: 1}, "Action had effect.");

        store.dispatch({ type: 'NONE_ACTION', payload: { a: 2 } });
        assert.deepStrictEqual(store.getState(), { a: 1 }, "Action had no effect.");
        done();
    });

    test("Update on change", done => {
        const MY_ACTION = 'MY_ACTION';
        const initialValue = { a: 1};
        const rootReducer = (state = initialValue, action) => action.type === MY_ACTION ?
            action.payload :
            state;

        let isUpdated = false;

        const store = createStore(rootReducer, () => isUpdated = true);

        store.dispatch({ type: MY_ACTION, payload: { a: 2 } });

        assert(!isUpdated, "Update is deferred.");

        setTimeout(() => {
            assert(isUpdated, "Update was called.");
            done();
        }, 30);
    });
});

