export class Emails{
  public updatedAt: Date;
  public createdAt: Date;
  public email: String;
  public is_primary: Boolean;
  public verification: Verification;
  constructor(email: any){
    if(email){
      this.updatedAt = email.updatedAt;
      this.createdAt = email.createdAt;
      this.email = email.email;
      this.is_primary = email.is_primary;
      this.verification = new Verification(email.verification);
    }
  }
}

export class Verification{
  public completed_at: Date;
  public complete: Boolean;
  public hash: Hash;
  constructor(verification: any){
    if(verification){
      this.completed_at = verification.completed_at;
      this.complete = verification.complete;
      this.hash = new Hash(verification.hash);
    }
  }
}

export class Hash{
  public expire_at: Date;
  public value: String;
  constructor(hash:any){
    if(hash){
      this.expire_at= hash.expire_at;
      this.value = hash.value;
    }
  }
}
