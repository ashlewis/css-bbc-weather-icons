module.exports = function(grunt) {

    // auto load all npm tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

        // read package.json file, this info may be used in these scripts
        pkg: grunt.file.readJSON('package.json'),

        
         // copy tasks
        copy: {
            dev: {
                // copy index file to dist                
                src: ['app/index.html'],
                dest: 'app/temp/index.html'                
            },
            dist: {
                // copy index file to dist
                src: ['app/index.html'],
                dest: 'app/dist/index.html'
            }            
        },

        // less compliation
        less: {
          all: {
            options: {
              paths: ["app/styles"]
            },
            files: {
              "app/temp/css/compiled.css": "app/styles/main.less"
            }
          }
        },

        // add vendor prefixes
        autoprefixer: {
            dev: {  
                files: {
                    'app/temp/css/main.css': 'app/temp/css/compiled.css'
                }
            },
            dist: {  
                files: {
                    'app/temp/css/autoprefixed.css': 'app/temp/css/compiled.css'
                }
            }
        },

        // need to run using --force flag
        // as currently fails on errors rather than warn
        csslint: {
            options: {
                // these should be taken care of by autoprefixer
                // which seesm to be more up to date than csslint
                'compatible-vendor-prefixes': false,
                'gradients': false
            },
            src: ['app/temp/css/autoprefixed.css']
                 
        },

        // compress (after autoprefixer has uncompressed :( )
        csso: {
          dist: {
            files: {
              'app/dist/css/main.css': ['app/temp/css/autoprefixed.css']
            }
          }
        },        

        // watch for file changes
        watch : {
            options: {
              // prevent cpu overload resulting in "killed"
              // also try running:
              // $ killall -9 node                 
              interval: 5007,
              spawn:false
            },
            
            // less files
            less: {
                files: ['app/index.html', 'app/styles/**/*.less'],
                tasks: ['less', 'autoprefixer', 'csslint']
            }, 

            index: {
                files: ['app/index.html'],
                tasks: ['copy:dev']
            }  
        }

    });
    
    // dev tasks
    grunt.registerTask('build:dev', [        
        'copy:dev',
        'less',
        'autoprefixer',
        'csslint',
        'watch'        
    ]);

    // dist tasks
    grunt.registerTask('build:dist', [
        'copy:dist',
        'less',
        'autoprefixer',
        'csslint',
        'csso'    
    ]);

    // Default task(s).
    grunt.registerTask('default', ['build:dev']);
};