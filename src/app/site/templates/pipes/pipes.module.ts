import { NgModule } from '@angular/core';
import { SafeHtml } from './safeHtml.pipe';
import { SafeStyle } from './safeStyle.pipe';
import { SafeUrl } from './safeUrl.pipe';
import { RemoveTags } from './RemoveTags.pipe';
import { CustomHtml } from './customHtml.pipe';
@NgModule({
  declarations: [SafeHtml, SafeStyle, SafeUrl, RemoveTags, CustomHtml],
  exports: [SafeHtml, SafeStyle, SafeUrl, RemoveTags, CustomHtml]
})
export class PipesModule { }


