
namespace JustinCredible.SampleApp.Interfaces {

    /**
     * A simple interface that describes a dictionary of objects indexed by string.
     */
    export interface Dictionary<T> {
        [index: string]: T;
    }
}
