import {Directive, Input, Renderer, ElementRef, OnChanges} from '@angular/core';

import {I18nService} from './i18n-service';

@Directive({
  selector: '[i18n],[i18n-placeholder]',
  providers: [],
  host: {}
})
export class I18nDirective implements OnChanges {
  @Input('i18n') content: string;
  @Input('i18n-placeholder') phContent: string;

  constructor(private i18n: I18nService, private el: ElementRef, private renderer: Renderer) {
  }

  ngOnChanges() {
    this.updateDirectiveContent();
  }

  private updateDirectiveContent() {
    this.loadAndRender(this.content, (s) => {
      this.renderer.setText(this.el.nativeElement, s);
    });

    this.loadAndRender(this.phContent, (s) => {
      this.renderer.setElementAttribute(this.el.nativeElement, 'placeholder', s);
    });
  }

  private loadAndRender(content: string, doRenderCallback) {
    if (!content) {
      return;
    }

    let code: string;
    let options: {} = {};
    try {
      let json = JSON.parse(content);
      code = Object.keys(json)[0];
      options = json[code];
    } catch (e) {
      code = content;
    }

    this.i18n.tPromise(code, options)
        .then((val: string) => {
          doRenderCallback(val);
        })
        .catch((err: Error) => {
          console.log('Rendering of value failed. Error: ', err);
        });
  }
}
