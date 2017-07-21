export class User {
  constructor(
    public name    : string,
    public emails      : Email,
    public role        : String,
    public companyname  : string,
    public domain       : string,
    public isLoggedIn  : Boolean,
    public password   : string,
    public promoCode : string,
  ) {  }
}
export class Email{
  constructor(
    public email: string,
    public is_primary: boolean
  ){}
}
