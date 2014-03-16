module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/jquery/jquery.js',
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'app/lib/underscore/underscore.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/*.js',
      //'test/unit/controllers/user.test.js',
      'test/unit/services/session.test.js',
      'test/unit/services/flash.test.js',
      'test/unit/services/authentication.test.js'
    ],

    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Firefox'],
    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
	});
}
