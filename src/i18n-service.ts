import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

declare var i18next: any;
declare var i18nextBrowserLanguageDetector: any;
declare var i18nextXHRBackend: any;

/* see I18nDirective for more information */
@Injectable()
export class I18nService {
  i18n: any;
  private init;

  alerts$: Observable<boolean>;
  private alertsObserver: any;

  constructor() {
    this.init = false;
    this.i18n = i18next;
    this.alerts$ = new Observable(observer => { 
	this.alertsObserver = observer; 
	this.i18n
	    .use(i18nextXHRBackend)
	    .use(i18nextBrowserLanguageDetector)
	    .init(
		{
		    detection: { order: ['navigator'] },
		    fallbackLng: 'en'
		},
		(err, t) => {
		    this.init = true;
		    this.alertsObserver.next(true);
		});
    }).share();      
  }

  t(s: string, opts: any = undefined) {
    return this.i18n.t(s, opts);
  }

  tPromise(s: string, opts: any = undefined) {
    return new Promise((resolve, reject) => {
      if (this.init) {
        resolve(this.i18n.t(s, opts));
      } else {
        reject(s);
      }
    });
  }
}
