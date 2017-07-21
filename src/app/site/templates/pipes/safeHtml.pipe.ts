import { Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml'
})

export class SafeHtml implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {
  }

  transform(html: any): string {
    let styleSanitized: any = this.sanitizer.bypassSecurityTrustStyle(html);
    let htmlSanitized: any = this.sanitizer.bypassSecurityTrustHtml(html);
    return htmlSanitized;
  }
}
