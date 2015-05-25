module JustinCredible.SampleApp.ViewModels {

    export class CategoryItemViewModel {
        public name: string;
        public href: string;
        public icon: string;
        public order: number;

        constructor(name: string, href: string, icon: string, order: number) {
            this.name = name;
            this.href = href;
            this.icon = icon;
            this.order = order;
        }
    }
}
