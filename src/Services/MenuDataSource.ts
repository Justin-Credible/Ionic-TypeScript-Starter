namespace JustinCredible.SampleApp.Services {

    /**
     * A data source for the hamburger menu.
     */
    export class MenuDataSource {

        //#region Injection

        public static ID = "MenuDataSource";

        public static get $inject(): string[] {
            return [
                Preferences.ID,
            ];
        }

        constructor(
            private Preferences: Preferences) {
        }

        //#endregion


        /**
         * Returns the categories for the application in their default sort order.
         */
        public get categories(): Models.Category[] {

            // Define the default set of categories.
            var categories = [
                new Models.Category("Category 1", "#/app/category/1", "ios-pricetags-outline", 0),
                new Models.Category("Category 2", "#/app/category/2", "ios-pricetags-outline", 1),
                new Models.Category("Category 3", "#/app/category/3", "ios-pricetags-outline", 2),
                new Models.Category("Category 4", "#/app/category/4", "ios-pricetags-outline", 3)
            ];

            // If the user has ordering preferences, then apply their custom ordering.
            if (this.Preferences.categoryOrder) {
                this.Preferences.categoryOrder.forEach((categoryName: string, index: number) => {
                    var categoryItem = _.where(categories, { name: categoryName })[0];

                    if (categoryItem) {
                        categoryItem.order = index;
                    }
                });
            }

            // Ensure the list is sorted by the order.
            categories = _.sortBy(categories, "order");

            return categories;
        }

        /**
         * Returns the view that is set as the default.
         * 
         * Currently, this is the category that is set in the first position.
         */
        public get defaultCategory(): Models.Category {
            return this.categories[0];
        }
    }
}
