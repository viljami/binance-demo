import { strict } from 'assert';
import { defer } from './defer.js';

const tests = [];
const isDone = ({ done, err }) => done || err;
let active = null;

export const assert = strict;

export function describe(name, fn) {
    const testSet = {
        name,
        fn,
        children: []
    };

    tests.push(testSet);

    active = testSet;

    fn();
};

export function test(name, fn) {
    const testCase = { name, fn, err: null, done: false };
    active.children.push(testCase);

    let setDone = () => testCase.done = true;

    defer(() => {
        try {
            fn(setDone);
        } catch (e) {
            console.error(e);
            testCase.err = e;
        }
    });
};

const reportTestCase = ({ name, err }) => {
    if (err) {
        console.error('  ', name, 'ERROR\n\n', err);
    } else {
        console.log('  ', name, 'OK');
    }
};

const report = () => {
    if (!tests.every(({ children }) => children.every(isDone))) {
        setTimeout(report, 100);
        return;
    }

    tests.forEach(({ name, children }) => {
        console.log('Test set:', name);
        children.forEach(reportTestCase);
    });
};

process.on('beforeExit', report);
