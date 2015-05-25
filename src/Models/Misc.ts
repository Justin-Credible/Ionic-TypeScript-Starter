module JustinCredible.SampleApp.Models {

    /**
     * A simple class that can be used to define a key/value pair of objects.
     */
    export class KeyValuePair<T, U> {
        public key: T;
        public value: U;

        constructor(key?: T, value?: U) {
            this.key = key;
            this.value = value;
        }
    }

    /**
     * Describes an object that can be disposed of, having any resources it was using
     * be released and/or cleaned up.
     */
    export interface IDisposable {
        dispose(): void;
    }

}
