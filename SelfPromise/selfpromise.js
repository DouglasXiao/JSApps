const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class SelfPromise {
        status = PENDING;
        value = null;
        reason = null;
        onFulfilledCallbacks = [];
        onRejectedCallbacks = [];

        constructor(executor) {
                try {
                        executor(this.resolve, this.reject);
                } catch (error) {
                        this.reject(error);
                }
        }

        resolve = (value) => {
                if (this.status === PENDING) {
                        this.status = FULFILLED;
                        this.value = value;
                        this.onFulfilledCallbacks.forEach(c => {
                                c(value);
                        });
                }
        }

        reject = (reason) => {
                if (this.status === PENDING) {
                        this.status = REJECTED;
                        this.reason = reason;
                        this.onRejectedCallbacks.forEach(c => {
                                c(reason);
                        });
                }
        }

        static resolve(param) {
                if (param instanceof SelfPromise) {
                        return param;
                }

                return new SelfPromise((resolve, reject) => {
                        if (param && typeof param.then === 'function') {
                                queueMicrotask(() => {
                                        param.then(resolve, reject);
                                });
                        } else {
                                resolve(param);
                        }
                });
        }

        static reject(param) {
                return new SelfPromise((resolve, reject) => {
                        reject(param);
                });
        }

        then(onFulfilled, onRejected) {
                const promise2 = new SelfPromise((resolve, reject) => {
                        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
                        onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason; };

                        const fulfilledMicrotask = () => {
                                queueMicrotask(() => {
                                        try {
                                                if (this.value && this.value.then === 'function') {
                                                        this.value.then(
                                                                (value) => {
                                                                        const v = onFulfilled(value);
                                                                        resolvePromise(promise2, v, resolve, reject);
                                                                },
                                                                (reason) => {
                                                                        const v = onRejected(reason);
                                                                        resolvePromise(promise2, v, resolve, reject);
                                                                }
                                                        );
                                                } else {
                                                        const v = onFulfilled(this.value);
                                                        resolvePromise(promise2, v, resolve, reject);        
                                                }
                                        } catch (error) {
                                                reject(error);
                                        }
                                });
                        };
                        const rejectedMicrotask = () => {
                                queueMicrotask(() => {
                                        try {
                                                const v = onRejected(this.reason);
                                                resolvePromise(promise2, v, resolve, reject);        
                                        } catch (error) {
                                                reject(error);
                                        }
                                });
                        };

                        if (this.status === FULFILLED) {
                                fulfilledMicrotask();
                        } else if (this.status === REJECTED) {
                                rejectedMicrotask();
                        } else {
                                this.onFulfilledCallbacks.push(onFulfilled);
                                this.onRejectedCallbacks.push(onRejected);
                        }        
                });

                return promise2;
        }

        catch(onRejected) {
                return this.then(null, onRejected);
        }

        finally(callback) {
                return this.then(
                        (value) => SelfPromise.resolve(callback()).then(() => value),
                        (reason) => SelfPromise.resolve(callback()).then(() => { throw reason; })
                );
        }
}

function resolvePromise(promise2, value, resolve, reject) {
        if (promise2 === value) {
                return reject(new TypeError('Chaining cycle detected for promise'));
        }
        if (typeof value === "object" || typeof value === "function") {
                if (value === null) {
                        return resolve(value);
                }
                let then;
                try {
                        then = value.then;
                } catch (error) {
                        return reject(error);
                }

                let called = false;
                try {
                        if (typeof value.then === "function") {
                                queueMicrotask(() => {
                                        then.call(
                                                value,
                                                (value2) => {
                                                        if (called) return;
                                                        called = true;
                                                        resolvePromise(promise2, value2, resolve, reject);
                                                },
                                                (reason2) => {
                                                        if (called) return;
                                                        called = true;
                                                        reject(reason2);
                                        });
                                });
                        } else {
                                resolve(value);
                        }
                } catch (error) {
                        if (called) return;
                        called = true;
                        reject(error);
                }
        } else {
                resolve(value);
        }
}

SelfPromise.deferred = function() {
        var result = {};
        result.promise = new SelfPromise(function (resolve, reject) {
                result.resolve = resolve;
                result.reject = reject;
        });
        return result;
}

module.exports = SelfPromise;

// SelfPromise.resolve()
//     .then(() => {
//         console.log(0);
//         return SelfPromise.resolve(4);
//     })
//     .then((res) => {
//         console.log(res);
//     });

//   SelfPromise.resolve()
//     .then(() => {
//         console.log(1);
//     })
//     .then(() => {
//         console.log(2);
//     })
//     .then(() => {
//         console.log(3);
//     })
//     .then(() => {
//         console.log(5);
//     });

// const p = new SelfPromise((resolve, reject) => {
//                 resolve(SelfPromise.reject(1));
//                 reject(2);
//         });
// p.then(value => {
//         console.log("onFulfilled", value);
// }, err => {
//         console.log("onRejected", err);
// })


// SelfPromise.reject(1).catch((reason) => {
//         console.log("catch", reason);
// }).finally((reason) => {
//         console.log("finally", reason);
//         return 2;
// }).then((value) => {
//         console.log("then", value);
// });

// const p = new SelfPromise((resolve, reject) => {
//         resolve(1);
// });
// const p1 = p.then(value => {
//         console.log(value);
//         return p1;
// });
// p1.then(value => {
//         console.log(2);
//         console.log('fulfilled', value);
// }, err => {
//         console.log(3);
//         console.log('reject', err.message);
// });
