
namespace JustinCredible.SampleApp {

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
                templateUrl: "Views/Root/Root.html",
                controller: Controllers.RootController.ID
            });

            // An blank view useful as a place holder etc.
            $stateProvider.state("app.blank", {
                url: "/blank",
                views: {
                    "root-view": {
                        templateUrl: "Views/Blank.html"
                    }
                }
            });

            // A shared view used between categories, assigned a number via the route URL (categoryNumber).
            $stateProvider.state("app.category", {
                url: "/category/:categoryNumber",
                views: {
                    "root-view": {
                        templateUrl: "Views/Category/Category.html",
                        controller: Controllers.CategoryController.ID
                    }
                }
            });

            //#region Onboarding

            $stateProvider.state("app.onboarding-splash", {
                url: "/onboarding/splash",
                views: {
                    "root-view": {
                        templateUrl: "Views/Onboarding/Onboarding-Splash/Onboarding-Splash.html",
                        controller: Controllers.OnboardingSplashController.ID
                    }
                }
            });

            $stateProvider.state("app.onboarding-register", {
                url: "/onboarding/register",
                views: {
                    "root-view": {
                        templateUrl: "Views/Onboarding/Onboarding-Register/Onboarding-Register.html",
                        controller: Controllers.OnboardingRegisterController.ID
                    }
                }
            });

            $stateProvider.state("app.onboarding-share", {
                url: "/onboarding/share",
                views: {
                    "root-view": {
                        templateUrl: "Views/Onboarding/Onboarding-Share/Onboarding-Share.html",
                        controller: Controllers.OnboardingShareController.ID
                    }
                }
            });

            //#endregion

            //#region Settings

            $stateProvider.state("app.settings-list", {
                url: "/settings/list",
                views: {
                    "root-view": {
                        templateUrl: "Views/Settings/Settings-List/Settings-List.html",
                        controller: Controllers.SettingsListController.ID
                    }
                }
            });

            $stateProvider.state("app.cloud-sync", {
                url: "/settings/cloud-sync",
                views: {
                    "root-view": {
                        templateUrl: "Views/Settings/Cloud-Sync/Cloud-Sync.html",
                        controller: Controllers.CloudSyncController.ID
                    }
                }
            });

            $stateProvider.state("app.configure-pin", {
                url: "/settings/configure-pin",
                views: {
                    "root-view": {
                        templateUrl: "Views/Settings/Configure-Pin/Configure-Pin.html",
                        controller: Controllers.ConfigurePinController.ID
                    }
                }
            });

            $stateProvider.state("app.developer", {
                url: "/settings/developer",
                views: {
                    "root-view": {
                        templateUrl: "Views/Settings/Developer/Developer.html",
                        controller: Controllers.DeveloperController.ID
                    }
                }
            });

            $stateProvider.state("app.logs", {
                url: "/settings/logs",
                views: {
                    "root-view": {
                        templateUrl: "Views/Settings/Logs-List/Logs-List.html",
                        controller: Controllers.LogsListController.ID
                    }
                }
            });

            $stateProvider.state("app.log-entry", {
                url: "/settings/log-entry/:id",
                params: {
                    id: {
                        value: "",
                        squash: false
                    }
                },
                views: {
                    "root-view": {
                        templateUrl: "Views/Settings/Log-Entry/Log-Entry.html",
                        controller: Controllers.LogEntryController.ID
                    }
                }
            });

            $stateProvider.state("app.about", {
                url: "/settings/about",
                views: {
                    "root-view": {
                        templateUrl: "Views/Settings/About/About.html",
                        controller: Controllers.AboutController.ID
                    }
                }
            });

            //#endregion

            // If none of the above states are matched, use the blank route.
            $urlRouterProvider.otherwise("/app/blank");
        }
    }
}
