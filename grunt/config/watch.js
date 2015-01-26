module.exports = function (grunt) {
    'use strict';

    var config = {

        watch: {

            grunt: {

                files: [
                    '<%= files.grunt %>'
                ],
                tasks: [
                    'jsbeautifier:beautify_grunt',
                    'jshint:grunt'
                ],
                options: {
                    spawn: false,
                    reload: true
                }
            },

            pkg: {

                files: [
                    '<%= files.pkg %>'
                ],
                tasks: [
                    'jshint:pkg'
                ],
                options: {
                    spawn: false
                }
            },

            src_js: {

                files: [
                    '<%= files.src_js %>'
                ],
                tasks: [
                    'jsbeautifier:beautify_src_js',
                    'jshint:src_js',
                    'group-build_js',
                    'group-build_test'
                ],
                options: {
                    spawn: false
                }
            },

            src_config: {

                files: [
                    '<%= files.src_config %>'
                ],
                tasks: [
                    'jsbeautifier:beautify_src_js',
                    'jshint:src_js',
                    'group-build_js',
                    'group-build_test',
                    'group-build_indexes'
                ],
                options: {
                    spawn: false,
                    reload: true
                }
            },

            src_spec: {

                files: [
                    '<%= files.src_spec %>'
                ],
                tasks: [
                    'jsbeautifier:beautify_src_spec',
                    'jshint:src_spec',
                    'group-build_test'
                ],
                options: {
                    spawn: false
                }
            },

            src_tpl: {

                files: [
                    '<%= files.src_tpl %>',
                ],
                tasks: [
                    'group-build_templates',
                    'group-build_test'
                ],
                options: {
                    spawn: false
                }
            },

            src_index: {

                files: [
                    '<%= files.src_index %>'
                ],
                tasks: [
                    'group-build_indexes'
                ],
                options: {
                    spawn: false
                }
            },

            src_less: {

                files: [
                    '<%= files.src_less %>'
                ],
                tasks: [
                    'group-build_css'
                ],
                options: {
                    spawn: false
                }
            },

            src_assets: {

                files: [
                    '<%= files.src_assets %>'
                ],
                tasks: [
                    'group-build_assets'
                ],
                options: {
                    spawn: false
                }
            }

            // -- docs (placeholder)

            /*
            docs: {

                files: [
                    '<%= files.docs %>'
                ],
                tasks: [
                    'docs'
                ],
                options: {
                    spawn: false
                }
            },
            */
        }
    };

    return config;
};

