export class Datatable {
  limits: number[] = [10, 25, 50, 100];
  current_limit: number = 10;
  total_pages: number = 1;
  search: string = '';
  current_page: number = 1;
  date_from: any = '';
  date_to: any = '';

  constructor() {
  }

  arrayOf(num: number): number[] {
    let array: number[] = [];
    let upper_limit: number;
    let lower_limit: number;
    if (this.current_page < 5) {
      if (this.total_pages < 5)
        upper_limit = this.total_pages - 1;
      else
        upper_limit = 5;

      lower_limit = 2;
    }
    else if (this.current_page >= 5 && this.current_page <= this.total_pages - 5) {
      if (this.total_pages < this.current_page + 1)
        upper_limit = this.total_pages - 1;
      else
        upper_limit = this.current_page + 1;
      lower_limit = this.current_page - 1;
    }
    else {
      upper_limit = this.total_pages - 1;
      lower_limit = this.total_pages - 5;
    }
    for (let i = lower_limit; i <= upper_limit; i++)
      array.push(i);
    return array;
  }

  paging(num: number) {
    this.current_page = num;
  }

  limitChange(event: any) {
    this.current_page = 1;
    this.current_limit = Number(event.target.value);
  }

  previous() {
    if (this.current_page != 1) {
      this.current_page--;
    }
  }

  next() {
    if (this.current_page != this.total_pages) {
      this.current_page++;
    }
  }

  searchData() {
    this.current_page = 1;
  }

  reset() {
    this.current_limit = 10;
    this.current_page = 1;
  }

}
