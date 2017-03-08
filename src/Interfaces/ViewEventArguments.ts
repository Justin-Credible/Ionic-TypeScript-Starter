
namespace JustinCredible.SampleApp.Interfaces {

    /**
     * Describes the event arguments passed to $ionicView events.
     */
    export interface ViewEventArguments {
        viewId: string;
        historyId: string;
        stateId: string;
        stateName: string;
        stateParams: {
            id: string;
            parent: string;
        };
        transition: string;
        navBarTransition: string;
        direction: string;
        shouldAnimate: boolean;
        transitionId: number;
        fromCache: boolean;
        enableBack: boolean;
        renderStart: boolean;
        renderEnd: boolean;
        viewNotified: boolean;
        title: string;
        showBack: boolean;
        navBarItems: any;
        navBarDelegate: any;
        showNavBar: boolean;
        hasHeaderBar: boolean;
    }
}
