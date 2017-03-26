module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        nggettext_extract: {
            pot: {
                files: {
                    'www/po/template.pot': ['www/index.html', 'www/js/kamusi.js']
                }
            }
        },
        nggettext_compile: {
            all: {
                files: {
                    'www/translations/translations.js': ['www/po/*.po']
                }
            }
        }
    });

    // Load angular-gettext plugin
    grunt.loadNpmTasks('grunt-angular-gettext');

    // Default task
    grunt.registerTask('default', ['nggettext_extract', 'nggettext_compile']);
    // extract and compile tasks
    grunt.registerTask('extract', ['nggettext_extract']);
    grunt.registerTask('compile', ['nggettext_compile']);

};
