import { Component, OnInit } from '@angular/core';
import { LondonerService } from './../../shared/services/londoner.service';

@Component({
  selector: 'app-londoner',
  templateUrl: './londoner.component.html',
  styleUrls: ['./londoner.component.css']
})
export class LondonerComponent implements OnInit {
  loading: boolean = true;
  constructor(private _http: LondonerService) { }

  ngOnInit() {
    this._http.getSoundCloud()
      .subscribe(data => console.log('Data: ', data)
      , err => console.log('Err: ', err))
  }

}
