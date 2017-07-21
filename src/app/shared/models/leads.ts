export class Leads{
  public total: any;
  public period: String;
  constructor(leads: any){
    if(leads){
      this.total = leads.total;
      this.period = leads.period;
    }
  }
}
