import { describe, test, assert } from './test-lib.js';

describe("Operations", () => {
    test("Test resolving with function", (done) => {
        done();
    });

    test("Test success test", (done) => {
        assert.strictEqual(1, 1, "One is equal to one.");
        done();
    });

    /**
        Due to restrictions test lib is part of the application source
        and not a separate package. Test if it is working by uncommenting.
        Otherwise it pollutes the the application test log. I also avoided
        doing more work on it by just commenting it out.
    */
    // test("Test failing test", (done) => {
    //     assert.strictEqual(1, 0, "One is not equal to zero.");
    //     done();
    // });
});

describe("Empty", () => undefined);
