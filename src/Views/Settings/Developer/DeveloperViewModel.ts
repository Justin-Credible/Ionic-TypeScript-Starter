namespace JustinCredible.SampleApp.ViewModels {

    export class DeveloperViewModel {
        mockApiRequests: boolean;

        devicePlatform: string;
        deviceModel: string;
        deviceOsVersion: string;
        deviceUuid: string;
        deviceCordovaVersion: string;

        navigatorPlatform: string;
        navigatorProduct: string;
        navigatorVendor: string;
        viewport: { width: number; height: number; };
        userAgent: string;

        userId: string;
        token: string;

        defaultStoragePathId: string;
        defaultStoragePath: string;

        apiUrl: string;
    }
}
