module.exports = {
    build_dir: 'build',
    compile_dir: 'bin',

    app_files: {
        js: ['src/**/*.js', '!src/**/*.spec.js'],
        jsunit: ['src/**/*.spec.js'],

        coffee: ['src/**/*.coffee', '!src/**/*.spec.coffee'],
        coffeeunit: ['src/**/*.spec.coffee'],

        atpl: ['src/app/**/*.tpl.html'],
        ctpl: ['src/common/**/*.tpl.html'],

        html: ['src/index.html'],
        less: ['src/less/main.less']
    },

    vendor_files: {
        js: [
            'vendor/jquery/dist/jquery.min.js'
          , 'vendor/pdfjs/pdf.js'
          , 'vendor/pdfjs/compatibility.js'
          , 'vendor/jquery-pdfdoc/jquery-pdfdoc.js'
          , 'vendor/bootstrap/dist/js/bootstrap.min.js'
          , 'vendor/hammerjs/hammer.min.js'
          , 'vendor/angular/angular.min.js'
          , 'vendor/angular-route/angular-route.min.js'
          , 'vendor/angular-animate/angular-animate.min.js'
          , 'vendor/angular-touch/angular-touch.min.js'
          , 'vendor/angular-translate/angular-translate.min.js'
          , 'vendor/angular-translate-loader-url/angular-translate-loader-url.min.js'
          , 'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'
          , 'vendor/angular-seo/angular-seo.js'
          , 'vendor/angular-hammer/angular-hammer.js'
        ],
        css: [
            'vendor/bootstrap/dist/css/bootstrap.min.css'
          , 'vendor/font-awesome/css/font-awesome.min.css'
          , 'vendor/jquery-pdfdoc/jquery-pdfdoc.css'
        ],
        assets: [
            'vendor/font-awesome/fonts/*'
        ]
    }
};