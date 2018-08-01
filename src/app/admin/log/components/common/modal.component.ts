import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "og-modal",
  templateUrl: "./modal.component.html",
  styleUrls: []
})
export class ModalComponent implements OnChanges {
  @Input() modalData: any;

  dataIsObject: boolean;
  selected: any;

  constructor() {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.modalData && !changes.modalData.isFirstChange()) {
      // exteranl API call or more preprocessing...
      this.setValues();
    }
  }

  setValues() {
    this.dataIsObject = this.testJSON();
    this.selected = this.testJSON() || (this.modalData !== "undefined" ? this.modalData :  "Data Not Present.");
  }

  getValue(data) {
    return JSON.stringify(data,null,2)
  }

  generateKeys(obj) {
    return Object.keys(obj);
  }

  // @desc: Check if string is valid for json.parse
  testJSON() {
    const body = this.modalData;
    if (!body || body === undefined) return false;
    try {
      return (typeof body === 'object') ? body : JSON.parse(body);
    } catch (error) {
      return false;
    }
  }
}
