
module JustinCredible.SampleApp {

    /**
     * Used to define all of the client-side routes for the application.
     * This maps routes to the controller/view that should be used.
     */
    export class RouteConfig {

        public static setupRoutes($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider): void {

            // Setup an abstract state for the tabs directive.
            $stateProvider.state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "templates/Menu.html",
                controller: "MenuController"
            });

            // An blank view useful as a place holder etc.
            $stateProvider.state("app.blank", {
                url: "/blank",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Blank.html"
                    }
                }
            });

            // A shared view used between categories, assigned a number via the route URL (categoryNumber).
            $stateProvider.state("app.category", {
                url: "/category/:categoryNumber",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Category.html",
                        controller: "CategoryController"
                    }
                }
            });

            //#region Onboarding

            $stateProvider.state("app.onboarding-splash", {
                url: "/onboarding/splash",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Onboarding/Onboarding-Splash.html",
                        controller: "OnboardingSplashController"
                    }
                }
            });

            $stateProvider.state("app.onboarding-register", {
                url: "/onboarding/register",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Onboarding/Onboarding-Register.html",
                        controller: "OnboardingRegisterController"
                    }
                }
            });

            $stateProvider.state("app.onboarding-share", {
                url: "/onboarding/share",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Onboarding/Onboarding-Share.html",
                        controller: "OnboardingShareController"
                    }
                }
            });

            //#endregion

            //#region Settings

            $stateProvider.state("app.settings-list", {
                url: "/settings/list",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Settings-List.html",
                        controller: "SettingsListController"
                    }
                }
            });

            $stateProvider.state("app.cloud-sync", {
                url: "/settings/cloud-sync",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Cloud-Sync.html",
                        controller: "CloudSyncController"
                    }
                }
            });

            $stateProvider.state("app.configure-pin", {
                url: "/settings/configure-pin",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Configure-Pin.html",
                        controller: "ConfigurePinController"
                    }
                }
            });

            $stateProvider.state("app.developer", {
                url: "/settings/developer",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Developer.html",
                        controller: "DeveloperController"
                    }
                }
            });

            $stateProvider.state("app.logs", {
                url: "/settings/logs",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Logs.html",
                        controller: "LogsController"
                    }
                }
            });

            $stateProvider.state("app.log-entry", {
                url: "/settings/log-entry/:id",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Log-Entry.html",
                        controller: "LogEntryController"
                    }
                }
            });

            $stateProvider.state("app.about", {
                url: "/settings/about",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/About.html",
                        controller: "AboutController"
                    }
                }
            });

            //#endregion

            // If none of the above states are matched, use the blank route.
            $urlRouterProvider.otherwise("/app/blank");
        }
    }
}