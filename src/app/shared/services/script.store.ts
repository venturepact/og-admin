interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  // //for plugins on builder page
  // { name: 'materialize', src: '../../../assets/js/materialize.js' },
  // { name: 'intro', src: '../../../assets/js/intro.js' },
  {name: 'wysiwyg', src: '../../../assets/js/wysiwyg.js'},
  // { name: 'link', src: '../../../assets/js/link.min.js' },
  // { name: 'code', src: '../../../assets/js/code_view.min.js' },
  // { name: 'colors', src: '../../../assets/js/colors.min.js' },
  // { name: 'font', src: '../../../assets/js/font_size.min.js' },
  // { name: 'filepicker', src: '//api.filestackapi.com/filestack.js' },
  // { name: 'filepickerv3', src: '//static.filestackapi.com/v3/filestack-0.6.3.js' },
  // { name: 'fancybox', src: '../../../assets/js/fancybox.js' },
  // { name: 'math', src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.3.0/math.min.js' },
  { name: 'highcharts', src: 'https://code.highcharts.com/highcharts.js' },
  { name: 'exporting', src: 'https://code.highcharts.com/modules/exporting.js' },
  // { name: 'jqueryUI', src: '//code.jquery.com/ui/1.11.4/jquery-ui.js' },
  // { name: 'clipboard', src: '../../../assets/js/clipboard.min.js' },
  // { name: 'rangeSlider', src: '../../../assets/js/ion.rangeSlider.min.js' },
  // { name: 'isotope', src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery.isotope/3.0.11/isotope.pkgd.min.js' },
  {name: 'selectize', src: '//cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.1/js/standalone/selectize.min.js'},
  //for graphs on analytics page
  { name: 'gCharts', src: 'https://www.gstatic.com/charts/loader.js' },
  { name: 'raphael', src: 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.7/raphael.min.js' },
  { name: 'morrisCharts', src: 'https://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js' },
  { name: 'daterangepicker', src: '../../../assets/js/daterangepicker.js' },
  { name: 'moment', src: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js' },
  //other scripts
  // { name: 'cardValidator', src: '../../../assets/js/jquery.creditCardValidator.js' },
  // { name: 'timeZoneMin', src: '../../../assets/js/timezones.full.min.js' },
  { name: 'googleLocation', src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDMGMieCyF6dY6nnRCkga45GVCXVuydaLA&libraries=places' },
  { name: 'datatables', src: 'https://cdn.datatables.net/v/dt/dt-1.10.12/datatables.min.js' },
  // { name: 'slimScroll', src: 'https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.8/jquery.slimscroll.min.js' },
  // { name: 'captcha', src: 'https://www.google.com/recaptcha/api.js' },
  // { name: 'iFrameResizer', src: '../../../assets/js/iFrameResizer.js' },
  // { name: 'colorPickerSliders', src: '../../../assets/js/bootstrap.colorpickersliders.js' },
  // { name: 'tinyColor', src: 'https://cdnjs.cloudflare.com/ajax/libs/tinycolor/1.4.1/tinycolor.js' },
  { name: 'bootBox', src: 'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js' },
  // { name: 'marketing', src: '../../../assets/js/marketing.js' },
  // { name: 'zapierIntegration1', src: 'https://zapier.com/zapbook/embed/widget.js?services=outgrow&container=true&limit=10&html_id=zapier' },
  // { name: 'zapierIntegration', src: 'https://zapier.com/zapbook/embed/widget.js?guided_zaps=14284,14285,14375,14280,14282,14277,14281,14279,14278&html_id=zapier' },
  // { name: 'fbPixel', src: '../../../assets/js/fb-pixel.js' },
  // { name: 'addRoll', src: 'https://s.adroll.com/j/roundtrip.js' },
  // { name: 'refersion', src: '../../../assets/js/refersion.js' },
  // { name: 'leaddyno', src: '../../../assets/js/leaddyno.js' },
  // { name: 'handsontable', src: '../../../assets/js/handsOnTable/handsontable.full.min.js' },
  // { name: 'elevio', src: '../../../assets/js/elevio.js' },
  // { name: 'jQuery-ui-Slider-Pips', src: '../../../assets/js/jQuery-ui-Slider-Pips.js' },
  { name: 'progressbar', src: './../../../assets/js/jQuery-plugin-progressbar.js' },
  // { name: 'JSHINT', src: '../../../assets/js/jshint.js' },
  // { name: 'NumberedTextarea', src: '../../../assets/js/jquery.numberedtextarea.js'}
  { name: 'ClipBoard', src: "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js"}
];
