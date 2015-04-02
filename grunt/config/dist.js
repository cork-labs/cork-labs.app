module.exports = function (grunt, data) {
    'use strict';

    var config = {

        clean: {

            dist: {

                __groups: ['dist_prepare'],
                src: '<%= paths.dist %>'
            }
        },

        karma: {

            dist: {

                __groups: ['dist_test'],
                browsers: '<%= vars.dist_test.browsers %>'
            }
        }
    };

    // targets generated dynamically from configuration

    var key;
    var target;

    // cssglue: css distribution tasks

    for (key in data.vars.dist_css) {
        target = grunt.util._.clone(data.vars.dist_css[key]);
        config.cssglue = config.cssglue || {};
        target.__groups = 'dist_css';
        config.cssglue['dist_css_' + key] = target;
    }

    // jsglue: js distribution tasks

    for (key in data.vars.dist_js) {
        target = grunt.util._.clone(data.vars.dist_js[key]);
        config.jsglue = config.jsglue || {};
        target.__groups = 'dist_js';
        config.jsglue['dist_js_' + key] = target;
    }

    return config;
};
