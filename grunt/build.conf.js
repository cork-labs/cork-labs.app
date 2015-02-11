module.exports = function (grunt) {
    'use strict';

    var fs = require('fs');

    var data = {

        // -- paths

        paths: {
            build: 'build',
            coverage: 'coverage',
            dist: 'dist',
            src: 'src',
            tmp: 'tmp',
            vendor: 'vendor'
        },

        // -- files

        files: {

            // -- config

            // linted
            // watched -> linted
            pkg: [
                'package.json',
                'bower.json'
            ],

            // beautified and linted
            // watched ->
            grunt: [
                'Gruntfile.js',
                'grunt/**/*.js'
            ],

            // -- source

            // beautified, linted and unit tested
            // all copied to build/src
            // loaded into browser by karma during unit tests
            // watched ->
            src_js: [
                '<%= paths.src %>/**/*.js',
                '!<%= paths.src %>/**/*.spec.js',
                '!<%= paths.src %>/**/*.mock.js',
            ],

            // beautified and linted
            // causes grunt config to reload
            src_config: [
                '<%= paths.src %>/config/*.json'
            ],

            // beautified and linted
            // loaded into browser by karma during unit tests
            src_spec: [
                '<%= paths.src %>/**/*.spec.js'
            ],

            // watched ->
            src_tpl: [
                '<%= paths.src %>/app/**/*.tpl.html'
            ],

            // watched ->
            src_less: [
                '<%= paths.src %>/**/*.less'
            ],

            // watched ->
            src_index: [
                '<%= paths.src %>/**/*.html',
                '!<%= paths.src %>/**/*.tpl.html',
                '!<%= paths.src %>/channel.html'
            ],

            // watched ->
            src_assets: [
                '<%= paths.src %>/assets/**/*'
            ],

            src_static: [
                '<%= paths.src %>/channel.html'
            ],

            // -- vendors

            // lib dependencies
            vendor_js: [
                '<%= paths.vendor %>/angular/angular.js',
                '<%= paths.vendor %>/angular-route/angular-route.js',
                '<%= paths.vendor %>/angular-cookies/angular-cookies.js',
                '<%= paths.vendor %>/ng.cl.router/dist/ng.cl.router.js',
                '<%= paths.vendor %>/ng.cl.prevent-nav/dist/ng.cl.prevent-nav.js',
                '<%= paths.vendor %>/ng.cx.config/dist/ng.cx.config.js'
            ],

            // test only dependencies (served by karma during tests)
            vendor_test_js: [
                '<%= paths.vendor %>/angular-mocks/angular-mocks.js'
            ],

            //
            vendor_css: [],

            //
            vendor_assets: [],

            // files to load in the browser, during tests

            karma_include: [
                '<%= files.vendor_js %>',
                '<%= files.vendor_test_js %>',
                '<%= files.src_spec %>',
                '<%= paths.src %>/**/*.js',

                // html2js.*.dest are appended in options/karma.js
            ],

            // contrived expression because pattern for karma preprocessors is a single minimatch
            karma_coverage: '<%= paths.src %>/**/!(*spec|*mock).js',

            // docs (placeholder, doc tasks not implemented yet)

            // watched ->
            docs: [
                '<%= files.src_js %>',
                '<%= paths.src %>/**/*.doc'
            ],
        },

        // -- vars

        vars: {

            license: '<% if (pkg.licenses) { %><%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>><% } %><% if (pkg.license) { %><%= pkg.license %><% }%>',

            banner: '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.url %>>\n' +
                ' * License: <%= vars.license %>\n' +
                ' */\n',

            ngNamespace: 'app',

            // -- build related

            // template modules to generate
            build_templates: {
                main: {
                    base: 'src/app',
                    src: 'src/app/**/*.tpl.html',
                    dest: '<%= paths.build %>/src/<%= vars.ngNamespace %>.templates.js',
                    name: '<%= vars.ngNamespace %>.templates'
                },
                lib: {
                    base: 'src/lib',
                    src: 'src/lib/**/*.tpl.html',
                    dest: '<%= paths.build %>/src/lib.templates.js',
                    name: 'lib.templates'
                }
            },

            // config modules to generate
            build_config: {
                main: {
                    src: '<%= paths.src %>/app/config.tpl',
                    dest: '<%= paths.build %>/src/<%= vars.ngNamespace %>.config.js',
                    data: {
                        moduleName: '<%= vars.ngNamespace %>.config',
                        appConfig: '<%= appConfig %>'
                    }
                }
            },

            // less entry points
            build_less: {
                main: {
                    src: ['<%= paths.src %>/main.less'],
                    dest: '<%= paths.build %>/src/main.css'
                }
            },

            // tests executed during build
            build_test: {
                browsers: [
                    'PhantomJS'
                    // 'Chrome',
                    // 'ChromeCanary',
                    // 'Firefox',
                    // 'Opera',
                    // 'Safari',
                ]
            },

            build_indexes: {
                index: {
                    src: [
                        '<%= files.vendor_js %>',
                        '<%= paths.build %>/src/**/*.js',
                        '<%= vars.build_config.main.dest %>',
                        '<%= vars.build_templates.main.dest %>',
                        '<%= files.vendor_css %>',
                        '<%= vars.build_less.main.dest %>'
                    ],
                    dest: '<%= paths.build %>/index.html',
                    template: '<%= paths.src %>/index.html'
                }
            },

            // -- dist related

            // css distribution files
            dist_css: {
                main: {
                    src: [
                        '<%= paths.src %>/main.less',
                        '<%= paths.src %>/css/**/*.css'
                    ],
                    dest: '<%= paths.dist %>/<%= pkg.name %>'
                }
            },

            // javascript distribution files
            dist_js: {
                main: {
                    src: [
                        '<%= files.src_js %>',
                        '<%= vars.build_templates.main.dest %>'
                    ],
                    dest: '<%= paths.dist %>/<%= pkg.name %>'
                }
            },

            // tests executed during dist
            dist_test: {
                browsers: [
                    'PhantomJS'
                    // 'Chrome',
                    // 'ChromeCanary',
                    // 'Firefox',
                    // 'Opera',
                    // 'Safari',
                ]
            }
        }
    };

    // load app config = base + environment overrides
    data.appConfig = grunt.loader.load('./src/config/config.json');
    var envConfigFile = './src/config/config.' + process.env.NODE_ENV + '.json';
    if (fs.existsSync(envConfigFile)) {
        grunt.loader.merge(envConfigFile, data.appConfig);
    }

    // -- development

    if (process.env.NODE_ENV === 'development') {

        // css for linking local fonts
        data.vars.build_less.main.src.unshift('<%= paths.src %>/fonts.less');

        // font-awesome
        data.files.vendor_css.push('<%= paths.vendor %>/font-awesome-bower/css/font-awesome.css');
        data.files.vendor_assets.push('<%= paths.vendor %>/font-awesome-bower/fonts/*');
    }

    return data;
};

