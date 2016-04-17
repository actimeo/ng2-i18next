[![npm version](https://badge.fury.io/js/ng2-i18next.svg)](https://badge.fury.io/js/ng2-i18next)

# ng2-i18next
Use i18next with Angular2.

This implementation uses the i18next XHR backend to read locales from XHR and the browser language detector module to detect language from the browser language preferences.

## A. Install 

> This procedure is based on a fresh angular-cli install.

### 1. install npm package
    npm install ng2-i18next --save

This will also install three i18next packages (i18next, i18next-browser-languagedetector and i18next-xhr-backend), necessary for this module to work.

### 2. Edit your angular-cli-build.js file

     var app = new Angular2App(defaults, {
         vendorNpmFiles: [ 
             'i18next/**', 
             'i18next-xhr-backend/**', 
             'i18next-browser-languagedetector/**', 
             'ng2-i18next/**'
        ]});
###3. Edit your index.html file

    [...]
    <script src="vendor/i18next/i18next.min.js"></script>
    <script src="vendor/i18next-xhr-backend/i18nextXHRBackend.min.js"></script>
    <script src="vendor/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js"></script>
    [...]
     <script>
     System.config({
       packages: {
         app: {
           format: 'register',
           defaultExtension: 'js'
         }
       },
       'vendor/ng2-i18next': {
         format: 'cjs',
         defaultExtension: 'js'
       }                
      },
      map: {
        'ng2-i18next': 'vendor/ng2-i18next'
       }
     });

##B. Usage

###1. Inject I18nService at bootstrap time
The I18nService will initialize the i18next object and load the locales via XHR backend. 
 

    import {I18nService} from 'ng2-i18next/ng2-i18next';
    bootstrap(Ng2MyApp, [I18nService]);

###2. Add your locales
Your locales have to be placed, for each language `<lang>`, in `src/client/locales/<lang>/translation.json` .

For example:
`src/client/locales/en/translation.json` :

    {
      "hello-world": "Hello World! ng2-i18next works!",
      "what-is-your-name": "What is your name?"
    }


`src/client/locales/fr/translation.json` :

    {
      "hello-world": "Salut les terriens ! ng2-i18next fonctionne !",
      "what-is-your-name": "Comment tu t'appelles ?"
    }

###3. Use the I18nDirective
Two directives are available:

 - `i18n` to replace the contents of a tag with the localization of the given key,
 - `i18n-placeholder` to replace the contents of the `placeholder` attribute with the localization of the given key.

`src/client/app/my-app.ts` :

    [...]
    import {I18nDirective} from 'ng2-i18next/ng2-i18next';
    [...]
    @Component({
    [...]
      templateUrl: 'app/m-app.html',
      directives: [I18nDirective]
    })

`src/client/app/my-app.html` :

    <p i18n="hello-world">i18n does not work!</p>
    <input type="text" i18n-placeholder="what-is-your-name">

###4. Use the `I18nService` `t()` method
####In the code:

    [...]
    import {I18nService} from 'ng2-i18next/ng2-i18next';
    [...]
    constructor(private i18n: I18nService) { }
    [...]
    myFunction() {
      var text = this.i18n.t('hello-world');
      [...]
    }

####In the template:
    <p>{{i18n.t('hello-world')}}</p>
