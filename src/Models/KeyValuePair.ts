
namespace JustinCredible.SampleApp.Models {

    /**
     * A simple class that can be used to define a key/value pair of objects.
     */
    export class KeyValuePair<K, V> implements Interfaces.KeyValuePair<K, V> {
        public key: K;
        public value: V;

        constructor(key?: K, value?: V) {
            this.key = key;
            this.value = value;
        }
    }
}
