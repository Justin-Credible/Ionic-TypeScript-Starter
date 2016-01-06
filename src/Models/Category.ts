namespace JustinCredible.SampleApp.Models {

    export class Category {
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
