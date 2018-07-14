
namespace JustinCredible.SampleApp.Interfaces.Services {

    export interface Logger {
        initialize(): void;
        debug(tagPrefix: string, tag: string, message: string, metadata?: any): void;
        info(tagPrefix: string, tag: string, message: string, metadata?: any): void;
        warn(tagPrefix: string, tag: string, message: string, metadata?: any): void;
        error(tagPrefix: string, tag: string, message: string, metadata?: any): void;
    }
}
