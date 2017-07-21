import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'prettyprintjson'
})
export class PrettyPrintJsonPipe implements PipeTransform{
  transform(jsonobj:any) {
    var json = JSON.stringify(jsonobj, undefined, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g,'<br/>').replace(/\\/g,'');
     json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
       
      // // let cls = 'number';
      // if(/^"/.test(match)) {
      //   if(/:$/.test(match))
      //     cls = 'key';
      //   else
      //     cls = 'string';
      // }else if(/true|false/.test(match))
      //   cls = 'boolean';
      // else if(/null/.test(match))
      //   cls = 'null';
      // if(match.lastIndexOf('$') >= 0)
        // return '<span class="'+ cls + ' highlight">' + match + '</span>';
      //   match.replace(/("<)/g,"<");
      //   match.replace(/(>")/g,">");
      //   console.log("match",match);

      // return match;
       var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    return json;
    
  }
}
