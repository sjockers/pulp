/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Pulp Toolkit - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://github.com/sjockers/pulp\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Simon Jockers; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },
    jasmine: {
      all: ['spec/runner/index.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/**/*.js'],
        dest: 'pulp.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'pulp.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint jasmine'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        predef: [
          "document", 
          "pulp"
        ]
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint jasmine concat min');
  grunt.loadNpmTasks('grunt-jasmine-task');
};
