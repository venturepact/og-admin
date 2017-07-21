import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'removeTags'
})

export class RemoveTags implements PipeTransform {

  constructor() {
    //code
  }

  transform(body: any): string {
    var regex = /(<([^>]+)>)/ig;
    var html = body.replace(regex, "");
    return html;
  }
}
