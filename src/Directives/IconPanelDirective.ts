module JustinCredible.SampleApp.Directives {

    //#region TypeScript Declarations

    /**
     * Used to describe a subset of the methods of this directive.
     */
    export interface IIconPanelDirectiveInstance {
        getName(): string;
        getIcon(): string;
        setIcon(icon: string): void;
        getIconSize(): number;
        setIconSize(size: number): void;
        getText(): string;
        setText(text: string): void;
    }

    /**
     * Describes the scope object for the IconPanel directive.
     */
    export interface IIconPanelDirectiveScope extends ng.IScope {
        name: string;
        icon: string;
        iconSize: string;
        text: string;
    }

    //#endregion

    /**
     * A simple element for showing a large icon centered, with optional text below it.
     */
    export class IconPanelDirective extends BaseElementDirective<IIconPanelDirectiveScope> implements IIconPanelDirectiveInstance {

        //#region Injection

        public static ID = "iconPanel";

        public static get $inject(): string[] {
            return [
                Services.Utilities.ID
            ];
        }

        constructor(
            private Utilities: Services.Utilities) {
            super();
        }

        //#endregion

        //#region Angular Directive Options

        public static restrict = "E";
        public static template = "<div></div>";
        public static replace = true;
        public static scope = {
            name: "@",
            icon: "@",
            iconSize: "@",
            text: "@"
        };

        //#endregion

        private _currentIcon: string;

        private _rootElement: HTMLDivElement;

        private _root: ng.IAugmentedJQuery;
        private _iconContainer: ng.IAugmentedJQuery;
        private _iconElement: ng.IAugmentedJQuery;
        private _textContainer: ng.IAugmentedJQuery;

        public initialize(): void {

            // Grab a reference to the root div element.
            this._rootElement = <HTMLDivElement>this.element[0];

            // Watch for the changing of the value attributes.
            this.scope.$watch(() => { return this.scope.icon; }, _.bind(this.icon_listener, this));
            this.scope.$watch(() => { return this.scope.iconSize; }, _.bind(this.iconSize_listener, this));
            this.scope.$watch(() => { return this.scope.text; }, _.bind(this.text_listener, this));

            // Fire a created event sending along this directive instance.
            // Parent scopes can listen for this so they can obtain a reference
            // to the instance so they can call getters/setters etc.
            if (this.scope.name) {
                this.scope.$emit(this.Utilities.format("icon-panel.{0}.created", this.scope.name), <IIconPanelDirectiveInstance>this);
            }
            else {
                this.scope.$emit("icon-panel.created", <IIconPanelDirectiveInstance>this);
            }
        }

        /**
         * Used to render the icon panel.
         */
        public render(): void {

            this._root = angular.element(this._rootElement);
            this._root.addClass("icon-panel");

            this._iconContainer = angular.element("<p></p>");
            this._iconContainer.addClass("icon-container");
            this._root.append(this._iconContainer);

            this._iconElement = angular.element("<i></i>");
            this._iconElement.addClass("icon");
            this._iconContainer.append(this._iconElement);

            this._textContainer = angular.element("<p></p>");
            this._root.append(this._textContainer);
        }

        /**
         * Returns the name of this instance.
         */
        public getName(): string {
            return this.scope.name;
        }

        /**
         * Returns the icon for this instance.
         */
        public getIcon(): string {
            return this._currentIcon;
        }

        /**
         * Sets the icon class for this instance.
         * 
         * This should be one of the Ionic icon class names (eg ion-ios-bell-outline).
         */
        public setIcon(icon: string): void {

            if (this._currentIcon) {
                this._iconElement.removeClass(this._currentIcon);
            }

            this._currentIcon = icon;

            this._iconElement.addClass(icon);
        }

        /**
         * Returns the font size in points used for the icon.
         */
        public getIconSize(): number {
            return parseInt(this.scope.iconSize, 10);
        }

        /**
         * Sets the font size in points used for the icon.
         */
        public setIconSize(size: number): void {
            this.scope.iconSize = (size ? size + "" : "0");
            this._iconElement.css("font-size", this.scope.iconSize + "pt");
        }

        /**
         * Returns the display text for this instance.
         */
        public getText(): string {
            return this.scope.text;
        }

        /**
         * Sets the display text for this instance.
         */
        public setText(text: string): void {
            this._textContainer.text(text);
        }

        //#region Listeners

        private icon_listener(newValue: string, oldValue: string, scope: IIconPanelDirectiveScope) {
            this._currentIcon = newValue;

            if (this._iconElement != null) {
                this._iconElement.removeClass(oldValue);
                this._iconElement.addClass(newValue);
            }
        }

        private iconSize_listener(newValue: string, oldValue: string, scope: IIconPanelDirectiveScope) {
            if (this._iconElement != null) {
                this._iconElement.css("font-size", newValue + "pt");
            }
        }

        private text_listener(newValue: string, oldValue: string, scope: IIconPanelDirectiveScope) {
            if (this._textContainer != null) {
                this._textContainer.text(newValue);
            }
        }

        //#endregion
    }
}
