import { Pipe, PipeTransform} from '@angular/core';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'safeUrl'
})

export class SafeUrl implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {
  }

  transform(url: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); }
}
