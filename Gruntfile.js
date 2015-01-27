module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),		

		requirejs: {
			compile: {
				options: {
					name: 'main',
					include: ['../config'],
					baseUrl: 'develop/js/modules',
					mainConfigFile: 'develop/js/config.js',
					out: 'develop/js/script.min.js',
					findNestedDependencies: true
				}
			}
		},

		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['requirejs', 'compass:dev']
			},
			scripts: {
				files: ['develop/js/*.js', 'develop/js/**/*.js', '!develop/js/script.min.js'],
				tasks: ['requirejs'],
				options: {
					spawn: false,
				}
			}
		},

		copy: {
			build: {
				files: [{
					expand: true,
					src: ['fonts/**'],
					cwd: 'develop',
					dest: 'build'
				}, {
					expand: true,
					src: [
						'img/**',
						'*.html',
						'js/vendor/requirejs/require.js',
						'js/script.min.js'
					],
					cwd: 'develop',
					dest: 'build'
				},
				{
					expand: true,
					src: [
						'css/**'
					],
					cwd: 'develop',
					dest: 'build',
					filter: '!style.css'
				}]
			}
		},

		clean: {
			app: ['build'],
			js: ['build/js/*.js'],
			css: ['build/css/*.css']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");

	grunt.registerTask('default', ['requirejs', 'watch']);
	grunt.registerTask('build', ['clean', 'requirejs', 'copy:build']);
};