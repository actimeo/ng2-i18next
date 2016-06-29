///<reference path="../typings/index.d.ts"/>
import {Injectable} from '@angular/core';

declare var i18next: any;

export class I18nServiceConfig {
  use: any[];
  config: any;
}

/* see I18nDirective for more information */
@Injectable()
export class I18nService {
  i18n: any;

  whenReady$: Promise<boolean>;

  constructor(private config: I18nServiceConfig) {
    this.i18n = i18next;
    this.whenReady$ = new Promise((resolve, reject) => {
      let i18nextUse = config.use;
      if (config.use) {
        for (let i = 0; i < i18nextUse.length; i++) {
          this.i18n.use(i18nextUse[i]);
        }
      }
      this.i18n.init(
          config.config,
          (err, t) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
    });
  }

  t(s: string, opts: any = undefined) {
    return this.i18n.t(s, opts);
  }

  tPromise(s: string, opts: any = undefined) {
    return this.whenReady$.then(() => Promise.resolve(this.i18n.t(s, opts)));
  }
}
