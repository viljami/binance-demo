import { describe, test, assert } from './test-lib.js';
import zip from './zip.js';

describe("Zip", () => {
    test('Zip two empty arrays', done => {
        const a = [];
        const b = [];
        assert.deepStrictEqual(zip(a, b), []);
        done();
    });

    test('Zip two arrays', done => {
        const a = [1, 2, 3];
        const b = [4, 5, 6];
        assert.deepStrictEqual(zip(a, b), [[1, 4], [2, 5], [3, 6]]);
        done();
    });

    test('Zip two different length arrays', done => {
        const a = [1, 2, 3];
        const b = [4, 5];
        assert.deepStrictEqual(zip(a, b), [[1, 4], [2, 5], [3, undefined]]);
        done();
    });
});
