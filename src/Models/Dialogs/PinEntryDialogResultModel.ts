module JustinCredible.SampleApp.Models {

    export class PinEntryDialogResultModel {
        matches: boolean;
        cancelled: boolean;
        pin: string;

        constructor(matches: boolean, cancelled: boolean, pin: string) {
            this.matches = matches;
            this.cancelled = cancelled;
            this.pin = pin;
        }
    }
}
