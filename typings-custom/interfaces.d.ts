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

	interface IRequestConfig {
		url: string;
		showSpinner: boolean;
		headers: any;
		blockingText: string;
		blocking: boolean;
		logRequestBody: string;
		data: string;
	}

	interface RequestConfig extends ng.IRequestConfig {
		url: string;
		showSpinner: boolean;
		headers: any;
		blockingText: string;
		blocking: boolean;
		logRequestBody: string;
		data: string;
	}

	interface BuildConfig {
		apiVersion: string;
		appName: string;
		appVersion: string;
		authorName: string;
		licenseUrl: string;
		authorWebsite: string;
		githubUrl: string;
		authorType: string;
		authorEmail: string;
	}
}