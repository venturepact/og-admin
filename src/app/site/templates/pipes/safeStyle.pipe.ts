import { Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'safeStyle'
})

export class SafeStyle implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {
  }

  transform(style: any): string {
    let styleSanitized: any = this.sanitizer.bypassSecurityTrustStyle(style);
    return styleSanitized;
  }
}
