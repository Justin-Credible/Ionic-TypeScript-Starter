// declare var Ionic: Ionic.IViewEventArguments;

declare module 'Interfaces' {
	export = Interfaces;
}

declare module Interfaces {
	interface BuildVars {
		buildTimestamp: string;
		config: any;
		commitShortSha: any;
		debug: boolean;
	}

	interface RequestConfig {
		url: string;
		blocking: any;
		showSpinner: boolean;
		headers: any;
	}

	interface BuildConfig {
		apiVersion: string;
	}
}