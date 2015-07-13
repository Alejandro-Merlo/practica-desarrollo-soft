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

    "bower-install-simple" : {
        options: {
            color: true,
            directory: "public/javascripts/lib"            
        },
        dev: {
            options: {
                production: false,
                forceLatest: true
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
  grunt.loadNpmTasks("grunt-bower-install-simple");

  grunt.registerTask("bower-install", [ "bower-install-simple" ]);
  grunt.registerTask('default', ['jshint', 'bower-install-simple', 'wiredep', 'karma']);
};