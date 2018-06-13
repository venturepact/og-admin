declare var jQuery;
export class JSONCompare{
  public compareJson(object1:any,object2:any){
    // Start Iterating With Object 1 to Find Properties that are  in Object 1 and not in Object 2 
    for (let propName in object1) {
        if (!this.isPropExistInBoth(object1,object2,propName)) { 
            this.modify(object1,propName,object1[propName]);
        }
        else if (!this.isValueTypeEqual(object1[propName],object2[propName])) {
            this.modify(object1,propName,object1[propName]);
        }
    }
    // Iterating through Object 2 to find Real difference between Two Objects
    for(let propName in object2) {
        let skip =false;
        if (!this.isPropExistInBoth(object1,object2,propName)) {
          this.modify(object2,propName,object2[propName]);
        }
        else if (!this.isValueTypeEqual(object1[propName],object2[propName])) {
            this.modify(object2,propName,object2[propName]);
            skip = true;
        }
        if(!object1.hasOwnProperty(propName))
          continue;

        if ( this.isArrayType(object1[propName]) && this.isArrayType(object2[propName]) ) {
           this.compareJson(object1[propName],object2[propName]);
           this.ArrayModifier(object1,propName,object1[propName]), this.ArrayModifier(object2,propName,object2[propName]);
        }
        else if (this.isObjectType(object1[propName]) && this.isObjectType(object2[propName])){
            this.compareJson(object1[propName],object2[propName]);
            this.ObjectModifier(object1,propName,object1[propName]),this.ObjectModifier(object2,propName,object2[propName]);          
        }
        else if(object1[propName] != object2[propName] && !skip) { 
            this.modify(object1,propName,object1[propName]), this.modify(object2,propName,object2[propName]);
        }
        else if(!skip){
             this.modify(object1,propName,object1[propName],'no-class'), this.modify(object2,propName,object2[propName],'no-class'); 
        }
    }
    return true;
  }
  private modify(ref,prop,value,cls='highlight'){
    ref[prop] = `<tr>${this.modifier(prop,ref[prop],cls)}</tr>`; 
  }
  private modifier(propName,value,cls){
    propName = propName ? propName + ':' : '&nbsp;';
   // return `<span class="${cls}">${ propName.toString() + JSON.stringify(value, null, 2).replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>')}</span></br>`
   return `<td >${ propName.toString()}</td><td class="${cls}">${JSON.stringify(value, null, 2).replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>')}</td>`;
  }
  private ObjectModifier(ref,prop,obj){
    let newString =`<tr><td> ${prop}</td><td>` //+ ':{ <br/>&nbsp;&nbsp;';
    Object.keys(obj).forEach((key)=>{
        if(this.typeOf(key) === '[object Object]'){
            this.ObjectModifier(obj,key,obj[key]);
            newString+= obj[key].toString();
        } else if(this.typeOf(key) === '[object Array]'){
            this.ArrayModifier(obj,key,obj[key]);
            newString+= obj[key].toString();
        }else
            newString += obj[key].toString();
    });
    newString+='</td></tr>';// "<br/>}";
    ref[prop]=newString;
    return true;
  }
  private ArrayModifier(ref,prop,arr,no_prop=false){
    let newString =`<tr><td>${prop}</td><td>`// + ':[ <br/>&nbsp;&nbsp;';
    arr.forEach((value,index)=>{
        if(this.typeOf(value) === '[object Object]'){
            this.ObjectModifier(arr,index,value);
            newString+= arr[index];
        } else if(this.typeOf(value) === '[object Array]'){
            this.ArrayModifier(arr,index,arr[index]);
            newString+= arr[index];
        }else    
            newString+=value.toString();
    })
    newString+= "</td></tr>";
    console.log(ref,"\n",prop,"\n",arr,"\n",newString);
    ref[prop] = newString;
  }
  private typeOf(obj){
    return Object.prototype.toString.call(obj);
  }
  private isPropExistInBoth(obj1,obj2,prop){
        return (obj1.hasOwnProperty(prop) === obj2.hasOwnProperty(prop));
  }
  private isValueTypeEqual(val1,val2){
    return (this.typeOf(val1) === this.typeOf(val1));
  }
  private isArrayType(obj){
    return (this.typeOf(obj) === '[object Array]'); 
  }
  private isObjectType(obj){
    return (this.typeOf(obj) === '[object Object]');
  }
}


export class JSONCompareForCache{
  public compareJson(object1:any){
    // Start Iterating With Object 1 to Find Properties that are  in Object 1 and not in Object 2 
    // for (let propName in object1) {
    //     // if (!this.isPropExistInBoth(object1,object2,propName)) { 
    //     //     this.modify(object1,propName,object1[propName]);
    //     // }
    //     // else if (!this.isValueTypeEqual(object1[propName],object2[propName])) {
    //     //     this.modify(object1,propName,object1[propName]);
    //     // }
    // }
    // Iterating through Object 2 to find Real difference between Two Objects
    for(let propName in object1) {
        let skip =false;
        // if (!this.isPropExistInBoth(object1,object2,propName)) {
        //   this.modify(object2,propName,object2[propName]);
        // }
        // else if (!this.isValueTypeEqual(object1[propName],object2[propName])) {
        //     this.modify(object2,propName,object2[propName]);
        //     skip = true;
        // }
        if(!object1.hasOwnProperty(propName))
          continue;

        if ( this.isArrayType(object1[propName])) {
            this.compareJson(object1[propName]);
           this.ArrayModifier(object1,propName,object1[propName]);
        }
        else if (this.isObjectType(object1[propName])){
            this.compareJson(object1[propName]);
            this.ObjectModifier(object1,propName,object1[propName]);          
        }
        // else if(!skip){
        //      this.modify(object1,propName,object1[propName],'no-class'); 
        // }
    }
    return true;
  }
  private modify(ref,prop,value,cls='highlight'){
    ref[prop] = `<tr>${this.modifier(prop,ref[prop],cls)}</tr>`; 
  }
  private modifier(propName,value,cls){
    propName = propName ? propName + ':' : '&nbsp;';
   // return `<span class="${cls}">${ propName.toString() + JSON.stringify(value, null, 2).replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>')}</span></br>`
   return `<td >${ propName.toString()}</td><td class="${cls}">${JSON.stringify(value, null, 2).replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>')}</td>`;
  }
  private ObjectModifier(ref,prop,obj){
    let newString =`<tr><td> ${prop}</td><td>` //+ ':{ <br/>&nbsp;&nbsp;';
    Object.keys(obj).forEach((key)=>{
        if(this.typeOf(key) === '[object Object]'){
            this.ObjectModifier(obj,key,obj[key]);
            newString+= obj[key].toString();
        } else if(this.typeOf(key) === '[object Array]'){
            this.ArrayModifier(obj,key,obj[key]);
            newString+= obj[key].toString();
        }else
            newString += obj[key].toString();
    });
    newString+='</td></tr>';// "<br/>}";
    ref[prop]=newString;
    return true;
  }
  private ArrayModifier(ref,prop,arr,no_prop=false){
    let newString =`<tr><td>${prop}</td><td>`// + ':[ <br/>&nbsp;&nbsp;';
    arr.forEach((value,index)=>{
        if(this.typeOf(value) === '[object Object]'){
            this.ObjectModifier(arr,index,value);
            newString+= arr[index];
        } else if(this.typeOf(value) === '[object Array]'){
            this.ArrayModifier(arr,index,arr[index]);
            newString+= arr[index];
        }else    
            newString+=value.toString();
    })
    newString+= "</td></tr>";
    console.log(ref,"\n",prop,"\n",arr,"\n",newString);
    ref[prop] = newString;
  }
  private typeOf(obj){
    return Object.prototype.toString.call(obj);
  }
  private isPropExistInBoth(obj1,obj2,prop){
        return (obj1.hasOwnProperty(prop) === obj2.hasOwnProperty(prop));
  }
  private isValueTypeEqual(val1,val2){
    return (this.typeOf(val1) === this.typeOf(val1));
  }
  private isArrayType(obj){
    return (this.typeOf(obj) === '[object Array]'); 
  }
  private isObjectType(obj){
    return (this.typeOf(obj) === '[object Object]');
  }
}
