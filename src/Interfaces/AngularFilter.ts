
namespace JustinCredible.SampleApp.Interfaces {

    /**
     * A simple interface that describes a class for an Angular filter.
     */
    export interface AngularFilter<T> {
        filter(input: T, ... args: any[]): any;
    }
}
