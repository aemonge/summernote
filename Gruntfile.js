module.exports = function (grunt) {
  'use strict';

  /**
   * read optional JSON from filepath
   * @param {String} filepath
   * @return {Object}
   */
  var readOptionalJSON = function (filepath) {
    var data = {};
    try {
      data = grunt.file.readJSON(filepath);
      // The concatenated file won't pass onevar
      // But our modules can
      delete data.onever;
    } catch (e) { }
    return data;
  };

  grunt.initConfig({
    // package File
    pkg: grunt.file.readJSON('package.json'),

    // bulid source(grunt-build.js).
    build: {
      all: {
        baseUrl: 'src/js',        // base url
        startFile: 'intro.js',    // intro part
        endFile: 'outro.js',      // outro part
        outFile: 'dist/summernote.js' // out file
      }
    },

    // for javascript convention.
    jshint: {
      all: {
        src: [
          'src/**/*.js', 'Gruntfile.js', 'test/**/*.js', 'build/*.js'
        ],
        options: {
          jshintrc: true
        }
      },
      dist: {
        src: 'dist/summernote.js',
        options: readOptionalJSON('.jshintrc')
      }
    },

    // qunit: javascript unit test.
    qunit: {
      all: [ 'test/*.html' ]
    },

    // uglify: minify javascript
    uglify: {
      all: {
        files: { 'dist/summernote.min.js': ['dist/summernote.js'] }
      }
    },

    // recess: minify stylesheets
    recess: {
      dist: {
        options: { compile: true, compress: true },
        files: {
          'dist/summernote.css': ['src/less/summernote.less']
        }
      }
    },

    // connect configuration.
    connect: {
      all: {
        options: {
          port: 3000,
          livereload: true,
          middleware: function (connect, options, middlewares) {
            middlewares = middlewares || [];
            return middlewares.concat([
              require('connect-livereload')(), // livereload middleware
              connect.static(options.base),    // serve static files
              connect.directory(options.base)  // make empty directories browsable
            ]);
          },
          open: 'http://localhost:3000'
        }
      }
    },

    // watch source code change
    watch: {
      all: {
        files: ['src/less/*.less', 'src/js/**/*.js'],
        tasks: ['recess', 'jshint', 'qunit'],
        options: {
          livereload: true
        }
      },
			joomla: {
        files: ['src/less/*.less', 'src/js/**/*.js'],
        tasks: ['recess', 'jshint', 'qunit'],
        options: {
          livereload: false
        }
      }
    },

		zip: {
			widgets: {
				router: function (filepath) {
					// Route each file to /{{filename}}
					var filename = path.basename(filepath);
					return filename;
				},
				src: ['src/joomla/*', 'dist/summernote.js' ],
				dest: 'dist/joomla-summernote.zip'
			}
		}
  });

  // load grunt tasks on package.json.
  require('load-grunt-tasks')(grunt);
  var path = require('path');
	grunt.loadNpmTasks('grunt-zip'); //TODO: move it into require

  // server
  grunt.registerTask('server', ['connect', 'watch']);

	// watchjoomla
  grunt.registerTask('watchjoomla', ['watch:joomla']);

  // build: build summernote.js
  grunt.loadTasks('build');

  // test: unit test on test folder
  grunt.registerTask('test', ['jshint', 'qunit']);

  // dist
  grunt.registerTask('dist', ['build', 'test', 'uglify', 'recess', 'zip']);

  // default: build, test, dist.
  grunt.registerTask('default', ['dist']);
};
