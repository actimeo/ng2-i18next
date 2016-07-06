[![npm version](https://badge.fury.io/js/ng2-i18next.svg)](https://badge.fury.io/js/ng2-i18next)

# ng2-i18next
Use i18next with Angular2.

A demo is available on [github: ng2-i18next-demo-rc3](https://github.com/actimeo/ng2-i18next-demo-rc3)

## A. Install 

> This procedure is based on a fresh angular-cli install and uses the i18next XHR backend to read locales from XHR and the browser language detector module to detect language from the browser language preferences.


### 1. install npm package
    npm install ng2-i18next --save

This will also install three i18next packages (i18next, i18next-browser-languagedetector and i18next-xhr-backend), necessary for this module to work.

### 2. Edit your angular-cli-build.js file

     var app = new Angular2App(defaults, {
         vendorNpmFiles: [ 
           ...,
           'i18next/**/*.+(js|js.map)',
           'i18next-xhr-backend/**/*.+(js|js.map)',
           'i18next-browser-languagedetector/**/*.+(js|js.map)',
           'ng2-i18next/**/*.+(js|js.map)'
         ]});

###3. Edit your system-config.ts file

    const map: any = {
      'ng2-i18next': 'vendor/ng2-i18next',
      'i18next': 'vendor/i18next/i18next.min.js',
      'i18nextXHRBackend': 'vendor/i18next-xhr-backend/i18nextXHRBackend.min.js',
      'i18nextBrowserLanguageDetector': 'vendor/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js'
    };

    /** User packages configuration. */
    const packages: any = {
      'vendor/ng2-i18next': {
        format: 'cjs',
        defaultExtension: 'js'
      },
      'i18next': { format: 'global' },
      'i18nextXHRBackend': { format: 'global' },
      'i18nextBrowserLanguageDetector': { format: 'global' }
    };

###4. Import the i18next modules from your main component

    import 'i18next';
    import 'i18nextXHRBackend';
    import 'i18nextBrowserLanguageDetector';

##B. Usage

###1. Inject I18nService in your main component
In this example, the I18nService will initialize the i18next object and load the locales via XHR backend and use browser language detector module. 
 

    import {I18nService, I18nServiceConfig} from 'ng2-i18next/ng2-i18next';
    
    declare var i18nextBrowserLanguageDetector: any;
    declare var i18nextXHRBackend: any;

    const NG2_I18NEXT_PROVIDERS = [
      provide(I18nServiceConfig, {
        useValue: {
          use: [i18nextBrowserLanguageDetector, i18nextXHRBackend],
          config: {
            detection: { order: ['navigator'] },
            fallbackLng: 'en'
          }
        }
      }),
      I18nService
    ];

    @Component({
      ...
      providers: [NG2_I18NEXT_PROVIDERS]
    })

###2. Add your locales
Your locales have to be placed, for each language `<lang>`, in `src/locales/<lang>/translation.json` .

For example:
`src/locales/en/translation.json` :

    {
      "hello-world": "Hello World! ng2-i18next works!",
      "what-is-your-name": "What is your name?"
    }


`src/locales/fr/translation.json` :

    {
      "hello-world": "Salut les terriens ! ng2-i18next fonctionne !",
      "what-is-your-name": "Comment tu t'appelles ?"
    }

###3. Use the I18nDirective
Two directives are available:

 - `i18n` to replace the contents of a tag with the localization of the given key,
 - `i18n-placeholder` to replace the contents of the `placeholder` attribute with the localization of the given key.

`src/app/app.component.ts` :

    [...]
    import {I18nDirective} from 'ng2-i18next/ng2-i18next';
    [...]
    @Component({
    [...]
      templateUrl: 'app.component.html',
      directives: [I18nDirective]
    })

`src/app/app.component.html` :

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

###5. Pass translation options to i18next

It is possible to pass options to the i18next module with this notation:

    <p i18n='{"not_found_key": {"defaultValue": "a default value via option"}}'></p>

    <p i18n='{"counter": {"count": {{theCounter}}}}'></p>

###6. Race at init time

The i18next module takes some time to load its locales files via XHR and initialize.

For this reason, it is possible that an early call to I18nService.t() does not return a correct value because the i18next module is not yet initialized.

You can subscribe to an observable defined by the I18nService which will send a message when initialization is done.

    // case when i18next is already initialized
    this.text = this.i18n.t('hello-world');
    // case when i18next is not yet initialized
    var obs = this.i18n.whenReady$.subscribe(b => {
      this.text = this.i18n.t('hello-world');
      obs.unsubscribe();
    });

Or, using a promise:

    this.loadAndRender('hello-world', s => this.text = s);
    
    loadAndRender(code: string, doRenderCallback) {
      if (!code) {
        return;
      }

      this.i18n.tPromise(code)

        .then((val: string) => {
          doRenderCallback(val);
        })

        .catch((val: string) => {
          doRenderCallback(' ');
          var obs = this.i18n.whenReady$.subscribe(b => {
            doRenderCallback(this.i18n.t(code));
            obs.unsubscribe();
          });
        });
    }

