module.exports = function(grunt) {
  
  grunt.initConfig({


  wiredep: {

      task: {

        src: ['views/**/*.ejs']

      },

      options : {
       ignorePath : "../public" 
      }


  },

  compile: {

        html: ['jade', 'wiredep'],

        styles: ['concat:styles', 'sass', 'clean:compile'],

        js: ['concat:js']

      }

    
  });

  grunt.loadNpmTasks('grunt-wiredep');
};