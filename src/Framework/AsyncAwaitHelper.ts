
namespace JustinCredible.SampleApp {

    /**
     * Normally, when using the await keyword to wait on a promise, if the promise is
     * rejected then an exception will be thrown. This means that to handle a rejection
     * you would need to try/catch all your await usages, which is inconvenient.
     * 
     * This helper is meant to be used with the await keyword to wrap the promise
     * so that it never throws an exception; it is guaranteed to resolve successfully.
     * 
     * In the case of an error, it will be available in the resolved result object so
     * that the caller can handle the error without a try/catch.
     * 
     * For example, this:
     * 
     * let data = null;
     * try {
     *      data = await this.DataSource.retrieve();
     * } catch (error) { ... }
     * 
     * becomes this:
     * 
     * let result = await on(this.DataSource.retrieve())
     * if (err) { ... }
     * let data = result.data;
     * 
     * If you want added protection against uncaught exceptions, wrap with a function:
     * 
     * let result = await on(() => this.DataSource.retrieve())
     * if (err) { ... }
     * let data = result.data;
     * 
     * @param promise The promise to wait on.
     * @returns A promise that ALWAYS resolves succesfully.
     */
    export function on<T>(promiseOrFactory: Promise<T> | ng.IPromise<T> | PromiseFactory<T>): Promise<OnResult<T>> {

        let promise: PromiseLike<T> = null;
        let factoryFunctionError: any;

        if (typeof(promiseOrFactory) === "function") {

            // If a factory function was passed, invoke it to obtain the promise.
            try {
                let factory = <PromiseFactory<T>> promiseOrFactory;
                promise = <PromiseLike<T>> factory();
            }
            catch (error) {
                // If the function threw an exception without returning a promise, then
                // save off the error so we can resolve with it below.
                factoryFunctionError = error;
            }
        }
        else {
            // If a promise was provided instead of a factory, use it.

            // The official Promise types conflict with Angular's types. For our purposes
            // it doesn't matter, we just need a .then(reject, resolve) method that we can
            // invoke down below. So we'll perform a cast to this generic type here.
            promise = <PromiseLike<T>> promiseOrFactory;
        }

        // Create a promise wrapper and listen for the then/catch on the original promise.
        // Note that we resolve successfully in both cases so a rejection will never occur.
        return new Promise<OnResult<T>>((resolve, reject) => {

            // If we don't have a promise at this point, either the factory function threw
            // an exception or the caller passed a null/undefined value into the on() helper.
            if (!promise) {

                let error = factoryFunctionError ? factoryFunctionError : new Error("AsyncAwaitHelper.on(): No promise was provided.");

                resolve({
                    error: error,
                    data: null,
                });

                return;
            }

            // If we did receive a promise, then wait for a success or rejection, and then
            // resolve the wrapped promise with the custom result interface structure.
            promise.then((data: T) => {

                resolve({
                    error: null,
                    data: data,
                });

            }, (error: any) => {

                resolve({
                    error: error,
                    data: null,
                });
            });
        });
    }

    /**
     * A factory function that returns a promise.
     */
    export type PromiseFactory<T> = () => Promise<T> | ng.IPromise<T>;

    /**
     * The result of the on() helper method for either a success or failure case.
     * 
     * If error is populated, the promise was rejected or threw an exception.
     * If data is populated, the promise resolved successfully.
     */
    export interface OnResult<T> {
        error: any;
        data: T;
    }
}
