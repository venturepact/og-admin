import {Component, Input, OnInit} from "@angular/core";
import {Datatable} from "../../shared/interfaces/datatable.interface";
import {AdminService} from "../../shared/services/admin.service";

declare var moment: any;

@Component({
  selector: 'hello-bar',
  templateUrl: './hello-bar.component.html'
})
export class HelloBarComponent extends Datatable implements OnInit {

  loading: boolean = false;
  createHelloBar: boolean = false;

  momentJs: any;
  hellobarData: Array<any> = [];
  selectedHellobar: any = null;

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.momentJs = moment;
    this.getHellobar();
  }

  paging(num: number) {
    super.paging(num);
    this.getHellobar();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getHellobar();
  }

  previous() {
    super.previous();
    this.getHellobar();
  }

  next() {
    super.next();
    this.getHellobar();
  }

  editHellobar(hellobar) {
    this.selectedHellobar = hellobar;
    this.createHelloBar = true;
  }

  createNewHellobar() {
    this.createHelloBar = true;
    this.selectedHellobar = null;
  }

  getHellobar() {
    this.loading = true;
    this.adminService.getHellobar({
      limit: this.current_limit,
      page: this.current_page - 1
    }).subscribe(data => {
      console.log(data);
      this.total_pages = Math.ceil(data.count / this.current_limit);
      this.loading = false;
      this.hellobarData = data.hellobar;
    })
  }

}
