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
  	  dev: {
        dest: 'public/javascripts/lib'
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