module JustinCredible.SampleApp.Models {

    export class PinEntryDialogModel {
        pinToMatch: string;
        promptText: string;
        showBackButton: boolean;

        constructor(promptText: string, pinToMatch: string, showBackButton: boolean) {
            this.promptText = promptText;
            this.pinToMatch = pinToMatch;
            this.showBackButton = showBackButton;
        }
    }
}
