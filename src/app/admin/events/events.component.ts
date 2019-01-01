import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Datatable } from '../../shared/interfaces/datatable.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EventsService } from '../../shared/services/events.service';
import { AdminService } from '../../shared/services/admin.service';
import { Script } from '../../shared/services/script.service';

declare var jQuery: any
declare var window: any;
declare var bootbox: any;
declare var moment: any;

@Component({
  selector: 'og-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css',
    './../../site/components/+analytics/assets/css/daterangepicker.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EventsComponent extends Datatable implements OnInit {
  edit: boolean;
  errorMessage = '';
  events: any = [];
  eventForm: FormGroup;
  loading: boolean;
  loader = false;
  mt = moment;
  newEvent: any;
  selectedItem: any;
  scriptLoaded: boolean = false;
  showAdvancedFilter: boolean = false;
  filters: any = [];
  filter = {
    event: [
      { name: "Event Name", id: "event_name" },
      { name: "Description", id: "description" },
      { name: "Event Type", id: "event_type" },
      { name: "Launch Date", id: "launch_date" },
      { name: "Created At", id: "created_at" }
    ],
    selected_property: "",
    selected_operator: "",
    selected_property_category: "",
    selected_property_type: "",
    selected_value: {},
    visible: true
  };
  @ViewChild('fileUpload') fileUpload: any;
  defaultColor = '#e9f2f9';
  eventColor = '';
  constructor(private _adminService: AdminService, private _eventsService: EventsService, private fb: FormBuilder, private _script: Script) {
    super()
  }

  ngOnInit() {
    this.eventColor = this.defaultColor;
    this.eventForm = this.fb.group({
      event_name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      description: ['', Validators.compose([Validators.required])],
      media: ['', Validators.compose([])],
      event_type: ['', Validators.required],
      launch_date: [''],
      launch_time: [''],
      color:['']
    });
    this.getEvents();
  }

  ngAfterViewInit() {
    this._script.load('daterangepicker')
      .then((data) => {
        console.log("daterangepicker::", data);
        this.scriptLoaded = true;
      })
  }

  getEvents() {
    this.loading = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search,
      filter: this.parseFilterData()
    };
    this._eventsService.getEvents(obj).subscribe((data) => {
      this.loading = false;
      this.total_pages = Math.ceil(data.count / this.current_limit);
      this.events = data.events;
      this.errorMessage = ''
    }, (error) => {
      this.loading = false;
      this.errorMessage = error.message;
      window.toastNotification("Failed to Load Events")
    })
  }

  changeButtonProps(ref, prop = {}) {
    Object.keys(prop).forEach(key => {
      ref[key] = prop[key];
    })
  }

  createEvent(data, btnRef: any = '') {
    btnRef && this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });
    data.launch_date = new Date(data.launch_date).toISOString();
    this.newEvent = this._eventsService.createEvent(data)
      .subscribe((response) => {
        this.getEvents();
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Add', disabled: false });
        jQuery('#add-event').modal('hide')
        this.errorMessage = '';
        window.toastNotification("Created a New Event Successfully...");
      }, error => {
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Add', disabled: false });
        // jQuery('#add-event').modal('hide')
        this.errorMessage = error.error.err_message;
      });
  }
  editEvent(index) {
    this.selectedItem = this.events[index];
    this.eventForm.get('event_name').setValue(this.selectedItem.event_name)
    this.eventForm.get('description').setValue(this.selectedItem.description)
    this.eventForm.get('media').setValue(this.selectedItem.media)
    this.eventForm.get('event_type').setValue(this.selectedItem.event_type)
    this.eventForm.get('launch_date').setValue(this.selectedItem.launch_date)
    this.eventForm.get('launch_time').setValue(this.selectedItem.launch_time);
    this.eventForm.get('color').setValue(this.selectedItem.color || this.defaultColor);
    this.eventColor = this.selectedItem.color || this.defaultColor;

    this.selectedItem['launch_date'] && (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(this.selectedItem['launch_date']).add(0, 'days').format('MM/DD/YYYY')),
      jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(this.selectedItem['launch_date']).utc().add(0, 'days').format('MM/DD/YYYY')));
    this.selectedItem['launch_date'] || (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(new Date()).add(0, 'days').format('MM/DD/YYYY')),
      jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(new Date()).utc().add(0, 'days').format('MM/DD/YYYY'))
    );

    this.edit = true;
    this.errorMessage = '';
    this.loader = false;
  }
  updateEvent(data, btnRef: any = '') {
    console.log(data);
    var updatedData = {
      _id: this.selectedItem['_id'],
      event_name: data.event_name,
      description: data.description,
      launch_date: new Date(data.launch_date).toISOString(),
      launch_time: data.launch_time,
      event_type: data.event_type,
      media: data.media,
      color:data.color
    };
    if (data.event_name != this.selectedItem.event_name || data.launch_date != this.selectedItem.launch_date) {
      updatedData['check'] = true;
    } else {
      updatedData['check'] = false
    }
    btnRef && this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });
    this._eventsService.updateEvent(updatedData)
      .subscribe((response) => {
        this.getEvents();
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Update', disabled: false });
        jQuery('#add-event').modal('hide')
        this.errorMessage = '';
        window.toastNotification("Event Updated Successfully...")
      }, error => {
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Update', disabled: false });
        // jQuery('#add-event').modal('hide')
        this.errorMessage = error.error.err_message;
      });
  }
  removeEvent(event, index) {
    let self = this;
    bootbox.dialog({
      size: 'small',
      message: `<div class="bootbox-body-left">
    <div class="mat-icon">
    <i class="material-icons">error</i>
    </div>
    </div>
    <div class="bootbox-body-right">
    <p class="one-line-para">Are you sure you want to delete this Event?</p>
    </div>
    `,
      buttons: {
        cancel: {
          label: "Cancel",
          className: "btn-cancel btn-cancel-hover",
        },
        success: {
          label: "OK",
          className: "btn btn-ok btn-hover",
          callback: function () {
            self._eventsService.removeEvent(event['_id']).subscribe((data) => {
              self.getEvents()
              this.errorMessage = ''
              window.toastNotification("Event Removed Successfully......")
            }, (error) => {
              this.errorMessage = error.message
            })
          }
        }
      }
    });
  }

  paging(num: number) {
    super.paging(num);
    this.getEvents();
  }
  limitChange(event: any) {
    super.limitChange(event);
    this.getEvents();
  }
  previous() {
    super.previous();
    this.getEvents();
  }
  next() {
    super.next();
    this.getEvents();
  }
  searchData() {
    super.searchData();
    this.getEvents();
  }
  upload(files: FileList, imgSrc: any) {
    let file: File = files.item(0);
    if (file.type.startsWith('image/')) {
      this.loader = true;
      this.uploadImageToServer(file);
    }
  }
  uploadImageToServer(url) {
    this._adminService.uploadGif(url).subscribe((data) => {
      this.loader = false;
      this.eventForm.get('media').setValue(data);
    }, error => {
      this.loader = false;
      this.eventForm.get('media').setValue('');
      console.log("err", error.error);
      // this.errorMessage = error.error.err_message;
    })
  }
  setLaunchDate(date) {
    console.log("date", date);
    this.eventForm.get('launch_date').setValue(date['start_date']);
  }

  addFilter() {
    this.filters.push(Object.assign({}, this.filter)); // passing filter by value
  }
  clearFilters() {
    this.filters.forEach(filter => (filter.visible = false));
  }
  removeFilter(index) {
    this.filters[index].visible = false;
  }
  setFilterProperty(target, index) {
    this.filters[index].selected_property_category =
      target.options[target.options.selectedIndex].className;
    this.filters[index].selected_property_type = "string";
    this.filters[index].selected_value = ""; // reset selected value
    this.filters[index].selected_operator = ''; // reset operator value
  }

  selected(event, index, type) {
    if (typeof this.filters[index].selected_value === "string") {
      this.filters[index].selected_value = {};
    }
    if (!Array.isArray(this.filters[index].selected_value[type])) {
      this.filters[index].selected_value[type] = [];
    }
    this.filters[index].selected_value[type].push(event.id);
  }
  select(event, index) {
    if (event.hasOwnProperty("start_date")) {
      this.filters[index].selected_value = event;
    } else {
      this.filters[index].selected_value = event.id;
    }
  }
  selectOperator(event, index) {
    if (event.id === "-1") {
      this.filters[index].selected_value = event.id;
      this.filters[index].selected_operator = event.id;
    } else {
      this.filters[index].selected_value = "";
      this.filters[index].selected_operator = event.id;
    }
  }

  removed(event, index, type) {
    if (event === "all") {
      this.filters[index].selected_value[type] = [];
    }
    let i = this.filters[index].selected_value[type].indexOf(event);
    this.filters[index].selected_value[type].splice(i, 1);
  }
  parseFilterData() {
    return this.filters
      .filter(
        el =>
          el.visible &&
          el.selected_property &&
          el.selected_property_category &&
          el.selected_property_type &&
          el.selected_value
      )
      .map(el => {
        let val = {
          property: el.selected_property,
          type: el.selected_property_category,
          value: el.selected_value,
          operator: el.selected_operator
        };
        return val;
      });
  }
  public onEventLog(event: string, data: any): void {
    console.log(event, data);
    this.eventForm.get('color').setValue(data);
  }
}
