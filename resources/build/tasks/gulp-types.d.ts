
/**
 * An object containing all available gulp plugins as loaded by gulp-load-plugins.
 */
export interface GulpPlugins {
    tslint: any;
    taskListing: any;
    util: any;
    uglify: any;
    angularTemplatecache: any;
    tar: any;
    gzip: any;
    if: any;
    eol: any;
    sourcemaps: any;
    sass: any;
    rename: any;
}

/**
 * A simple interface that describes a dictionary of objects indexed by string.
 */
export interface Dictionary<T> {
    [index: string]: T;
}

/**
 * Describes an object parsed from schemes.yml
 */
export interface SchemesConfig {
    default: string;
    overrides: Dictionary<Dictionary<any>>;
    schemes: Dictionary<Scheme>;
}

/**
 * Describes a single scheme parsed from schemes.yml
 */
export interface Scheme {
    base: string;
    debug: boolean;
    replacements: Dictionary<any>;
}

/**
 * Describes an object parsed from index.references.yml
 */
export interface ReferencesConfig {
    css: string[];
    lib: string[];
    js: string[];
}

/**
 * Describes a content security policy dictionary.
 */
export interface ContentSecurityPolicyDictionary {
    default_src: string[];
    manifest_src: string[];
    script_src: string[];
    style_src: string[];
    img_src: string[];
    connect_src: string[];
    font_src: string[];
    object_src: string[];
    media_src: string[];
    frame_src: string[];
    sandbox: string[];
    report_uri: string[];
    child_src: string[];
    form_action: string[];
    frame_ancestors: string[];
    plugin_types: string[];
}
