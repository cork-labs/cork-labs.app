module.exports = function (grunt, data) {
    'use strict';

    var config = {

        clean: {

            build: {

                __groups: ['build_prepare'],
                src: '<%= paths.build %>'
            }
        },

        copy: {

            build_src_js: {

                __groups: ['build_js'],
                files: [{
                    src: '<%= files.src_js %>',
                    dest: '<%= paths.build %>/'
                }]
            },

            build_less_srcs: {

                __groups: ['build_css'],
                files: [{
                    src: '<%= files.src_less %>',
                    dest: '<%= paths.build %>/'
                }]
            },

            build_src_assets: {

                __groups: ['build_assets'],
                files: [{
                    src: '<%= files.src_assets %>',
                    dest: '<%= paths.build %>/'
                }]
            },

            build_vendor_js: {

                __groups: ['build_vendors'],
                files: [{
                    src: '<%= files.vendor_js %>',
                    dest: '<%= paths.build %>/'
                }]
            },

            build_vendor_css: {

                __groups: ['build_vendors'],
                files: [{
                    src: '<%= files.vendor_css %>',
                    dest: '<%= paths.build %>/'
                }]
            },

            build_vendor_assets: {

                __groups: ['build_vendors'],
                files: [{
                    src: '<%= files.vendor_assets %>',
                    dest: '<%= paths.build %>/'
                }]
            }
        },

        karma: {

            unit: {

                __groups: ['build_test'],
                // overriding this value for development unit testing.
                client: {
                    captureConsole: true
                },
                browsers: '<%= vars.build_test.browsers %>'
            }
        },

        shell: {

            publish_coverage: {

                __groups: ['build_test'],
                command: 'mkdir <%= paths.build %>; ln -s ../<%= paths.coverage %> <%= paths.build %>/',
                options: {
                    failOnError: false
                }
            }
        }
    };

    // targets generated dynamically from configuration

    var key;
    var target;

    // html2js: generate template modules

    for (key in data.vars.build_templates || {}) {
        config.html2js = config.html2js || {};
        target = data.vars.build_templates[key];
        config.html2js['build_templates_' + key] = {
            __groups: ['build_templates'],
            src: target.src,
            dest: target.dest,
            options: {
                base: target.base || '',
                module: target.name
            }
        };
    }

    // less: compile less files

    for (key in data.vars.build_less || {}) {
        config.less = config.less || {};
        target = data.vars.build_less[key];
        config.less['build_css_' + key] = {
            __groups: ['build_css'],
            src: target.src,
            dest: target.dest,
            options: {
                sourceMap: true,
                dumpLineNumbers: 'all'
            }
        };
    }

    // sass: compile sass files

    for (key in data.vars.build_sass || {}) {
        config.sass = config.sass || {};
        target = data.vars.build_sass[key];
        config.sass['build_css_' + key] = {
            __groups: ['build_css'],
            src: target.src,
            dest: target.dest,
            options: {
                sourcemap: 'auto',
                dumpLineNumbers: 'all'
            }
        };
    }

    // template: config files to generate

    for (key in data.vars.build_config || {}) {
        config.template = config.template || {};
        target = data.vars.build_config[key];
        config.template['build_config_' + key] = {
            __groups: ['build_js'],
            src: target.src,
            dest: target.dest,
            options: {
                data: target.data
            }
        };
    }

    // ngindex: index files to generate

    for (key in data.vars.build_indexes || {}) {
        config.ngindex = config.ngindex || {};
        target = data.vars.build_indexes[key];
        config.ngindex['build_indexes_' + key] = {
            __groups: ['build_indexes'],
            src: target.src,
            dest: target.dest,
            options: {
                template: target.template
            }
        };
    }

    return config;
};

