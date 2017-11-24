import {Component, OnInit} from "@angular/core";
import {Datatable} from "../../shared/interfaces/datatable.interface";

@Component({
  selector: 'hello-bar',
  templateUrl: './hello-bar.component.html'
})
export class HelloBarComponent extends Datatable implements OnInit {

  loading: boolean = false;
  createHelloBar: boolean = false;


  ngOnInit() {

  }

}
