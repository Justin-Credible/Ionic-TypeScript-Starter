
namespace JustinCredible.SampleApp.Models {

    export enum LogLevel {
        Debug = 0,
        Info = 1,
        Warn = 2,
        Error = 3
    }
}

// By using the same namespace, we can add static helper methods to the enumeration.
namespace JustinCredible.SampleApp.Models.LogLevel {

    /**
     * A helper used to get an icon name for the given log level.
     * 
     * @param level The level of the log to get an icon name for.
     * @returns A string of an icon name for the given log level.
     */
    export function getIcon(level: LogLevel): string {

        switch (level) {
            case Models.LogLevel.Debug:
                return "ion-bug";
            case Models.LogLevel.Info:
                return "ion-ios-information";
            case Models.LogLevel.Warn:
                return "ion-alert-circled";
            case Models.LogLevel.Error:
                return "ion-android-alert";
            default:
                return "ion-android-alert";
        }
    }

    /**
     * A helper used to get a color in hex value for the given log level.
     * 
     * @param level The level of the log to get a color for.
     * @returns A hex value of a color for the given log level.
     */
    export function getColor(level: LogLevel): string {

        switch (level) {
            case Models.LogLevel.Debug:
                return "#000080"; // Navy
            case Models.LogLevel.Info:
                return "#000000"; // Black
            case Models.LogLevel.Warn:
                return "#ff8000"; // Orange
            case Models.LogLevel.Error:
                return "#ff0000"; // Red
            default:
                return "#000000"; // Black
        }
    }

    /**
     * A helper used to get friendly name for display for the given log level.
     * 
     * @param level The level of the log to get a display name for.
     * @returns A display name of for the given log level.
     */
    export function getDisplayText(level: LogLevel): string {

        switch (level) {
            case Models.LogLevel.Debug:
                return "Debug";
            case Models.LogLevel.Info:
                return "Info";
            case Models.LogLevel.Warn:
                return "Warning";
            case Models.LogLevel.Error:
                return "Error";
            default:
                return "Unknown";
        }
    }
}
