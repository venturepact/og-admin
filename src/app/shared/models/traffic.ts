export class Traffic{
  public frequency: any;
  public period: String;
  constructor(traffic: any){
    if(traffic){
      this.frequency = traffic.frequency;
      this.period = traffic.period;
    }
  }
}
