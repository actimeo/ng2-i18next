import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

declare var i18next: any;

export class I18nServiceConfig {
  use: any[];
  config: any;
}

/* see I18nDirective for more information */
@Injectable()
export class I18nService {
  i18n: any;
  private init;

  whenReady$: Observable<boolean>;
  private whenReadyObserver: any;

  constructor(private config: I18nServiceConfig) {
    this.init = false;
    this.i18n = i18next;
    this.whenReady$ = new Observable(observer => {
      this.whenReadyObserver = observer;
      let i18nextUse = config.use;
      if (config.use) {
        for (let i = 0; i < i18nextUse.length; i++) {
          this.i18n.use(i18nextUse[i]);
        }
      }
      this.i18n.init(
        config.config,
        (err, t) => {
          this.init = true;
          this.whenReadyObserver.next(true);
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
