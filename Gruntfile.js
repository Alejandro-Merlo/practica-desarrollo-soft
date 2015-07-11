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

  bower: {

  	dev: {

    	dest: 'public/javascripts/lib'
  	
  	}

  }

  compile: {

        html: ['jade', 'wiredep'],

        styles: ['concat:styles', 'sass', 'clean:compile'],

        js: ['concat:js']

      }

    
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower');
  grunt.registerTask('default', ['jshint', 'wiredep', 'bower']);
};