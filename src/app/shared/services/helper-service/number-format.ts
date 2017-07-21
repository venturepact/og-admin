export class NumberFormater{
  public static insertCommas(value: number): string 
   {
     var number = value.toString();
     if( value < 1000 )
       return number;
     var decimalPart = "";
     var decimal     = number.indexOf(".");
     if( decimal != -1 )
     {
       decimalPart = number.substring(decimal, number.length);
       number      = number.substring(0,decimal);
     }
    
     var withCommas = "";
     var len        = number.length;
     var i          = 1;
  
     withCommas += number.charAt(0);
  
     while( i < len )
     {
       if( (len-i)%3 == 0 ) 
         withCommas += ",";
      
       withCommas += number.charAt(i);
       i++;
     }

     withCommas = decimal == -1 ? withCommas : withCommas + decimalPart;
  
     return withCommas;
  }
}