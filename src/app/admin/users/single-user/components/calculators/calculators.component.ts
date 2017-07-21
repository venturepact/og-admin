import { Component} from '@angular/core';
declare var jQuery:any;
@Component({
  selector: 'og-calculators',
  templateUrl: './calculators.component.html',
  styleUrls: ['./calculators.component.css'],
})

export class CalculatorsComponent {
  public id: number;
  constructor() {
    // this.route.params.subscribe(params => {
    //    this.id = params['id'];
    //    console.log('user id',this.id);
    // });
  }
}

