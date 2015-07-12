module.exports = function(grunt) {
  
  grunt.initConfig({

    jshint: {
      all: ['Gruntfile.js', 'app.js', 'public/javascripts/angularApp.js']
    },

    wiredep: {
      task: {
        src: ['views/**/*.ejs']
      },

      options : {
        ignorePath : "../public" 
      }
    },

    compile: {
      html: ['wiredep'],
      styles: ['clean:compile'],
    },

    bower: {
      install: {
      	options: {
      	  targetDir: 'public/javascripts/lib',
          install: true,
          verbose: true,
          cleanBowerDir: true
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('default', ['jshint', 'wiredep', 'bower', 'karma']);
};