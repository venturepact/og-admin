import { Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'customHtml'
})

export class CustomHtml implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {
  }

  transform(html: any): string {
    html = JSON.stringify(html).replace(/<style>(.*?)<\/style>|<style>/,'').replace(/<script>(.*?)<\/script>|<script>/,'');
    let htmlSanitized: any = this.sanitizer.bypassSecurityTrustHtml(JSON.parse(html));
    return htmlSanitized;
  }
}
