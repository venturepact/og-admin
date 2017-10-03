import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'og-integration-log-details',
  templateUrl: './integration-log-details.component.html',
  styleUrls: ['./integration-log-details.component.css']
})
export class IntegrationLogDetailsComponent implements OnInit {

  @Input()
  log: any;

  constructor() {
  }

  ngOnInit() {
  }

}
