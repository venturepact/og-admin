import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation} from '@angular/core';

declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'og-date-picker',
  templateUrl: './date_picker.component.html',
  encapsulation: ViewEncapsulation.None
})

export class DatePickerComponent implements AfterViewInit, OnChanges {
  @Input() calc: any;
  @Output() date: EventEmitter<String> = new EventEmitter<String>();
  @Input() parentElementName?:any;
  initialized: boolean = false;

  ngAfterViewInit() {
    var self: any = this;
    // TODO error in these two functions so commented it.
    //Data range Picker
    let startDate = this.calc ? this.calc.createdAt : moment().subtract(10, 'days').calendar();
    let {start_date, end_date} = this.getStartEndDates(startDate, new Date(), 'MM/DD/YYYY');

    jQuery('.input-daterange-datepicker').daterangepicker({
      singleDatePicker: true,
      buttonClasses: ['btn', 'btn-sm'],
      applyClass: 'btn-danger',
      cancelClass: 'btn-inverse',
      maxDate: this.getUTCDate(new Date(), 'MM/DD/YYYY', 180)
    });

    //On Date Apply
    jQuery('.input-daterange-datepicker').on('apply.daterangepicker', (ev: any, picker: any) => {
      start_date = moment(new Date(picker.startDate.format('YYYY-MM-DD'))).utc().add(0, 'days').format('YYYY-MM-DD');
      end_date = moment(new Date(picker.endDate.format('YYYY-MM-DD'))).utc().add(1, 'days').format('YYYY-MM-DD');
      self.date.emit({start_date, end_date});
      localStorage.setItem('df', JSON.stringify({start_date, end_date}));
    });

    this.initialized = true;
  }

  ngOnChanges(): void {
    if (this.initialized) {
      let startDate = this.calc ? this.calc.createdAt : moment().subtract(10, 'days').calendar();
      jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(this.getUTCDate(startDate, 'MM/DD/YYYY'));
      jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(this.getUTCDate(new Date(), 'MM/DD/YYYY'));
      localStorage.removeItem('df');
    }
  }

  getUTCDate(date: any = new Date(), format: string = 'YYYY-MM-DD', addDays: number = 0) {
    return moment(date).utc().add(addDays, 'days').format(format);
  }


  getStartEndDates(startDate: any, endDate: any, format: string = 'YYYY-MM-DD') {
    let start_date, end_date;
    let dateFilterApplied = localStorage.getItem('df');
    if (dateFilterApplied && format == 'YYYY-MM-DD') {
      let dateFilterDate = JSON.parse(dateFilterApplied);
      start_date = moment(dateFilterDate.start_date).format(format);
      end_date = moment(dateFilterDate.end_date).format(format);
    } else if (dateFilterApplied && format != 'YYYY-MM-DD') {
      let dateFilterDate = JSON.parse(dateFilterApplied);
      start_date = moment(dateFilterDate.start_date).format(format);
      end_date = moment(dateFilterDate.end_date).add(-1, 'days').format(format);
    } else {
      start_date = moment(startDate).utc().add(-1, 'days').format(format);
      end_date = moment(endDate).utc().add(1, 'days').format(format);
    }
    return {start_date, end_date};
  }
  addClass(){
    (this.parentElementName) && (jQuery(`#${this.parentElementName}`).addClass('oh'));
  }
  removeClass(){
    (this.parentElementName) && jQuery("#add-calc").removeClass('oh');
  }
}

