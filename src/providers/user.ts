import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 */
@Injectable()
export class User {
  // _user: any;
  private USER_KEY: string = 'user';
  errorMessage: string;
  user: { name: string, password: string, authority: any} = {
    name: '',
    password: '',
    authority: ''
  };

  constructor(public http: Http, public storage: Storage) {
  }

  getUrlParam(obj: any) {
    var str =[];
    for (var p in obj){
      if ( p.lastIndexOf('hashKey') == -1) {
         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));        
      } 
    }
    return str.join("&").toString();
  }

  /**
   */
  login(accountInfo: any) {
    // let seq =  this.http.get('http://localhost:8080/MyLearnApp/login?'+ this.getUrlParam(accountInfo),{}).share();
    let seq =  this.http.get('http://182.61.12.39:8080/MyLearnApp/login?'+ this.getUrlParam(accountInfo),{}).share();
    // let seq =  this.http.get('https://mylearnapp.au-syd.mybluemix.net/myLearnApp/testhealth',{}).share();
    // let seq =  this.http.get('https://mylearnappus.mybluemix.net/MyLearnApp/login?'+ this.getUrlParam(accountInfo),{}).share();
    seq
      .map(res => res.json())
      .subscribe(data => {
          if (data.message == 'success'){
            this.user = data.user;
            this.save();
          } else {
            this.user = null;
            this.errorMessage = data.message;  
          }
      }, error => {
          //console.log(JSON.stringify(error));
          // this.errorMessage = JSON.stringify(error);
          this.errorMessage = 'AP Server Access Error';
      });
    return seq;
  }

  /**
   */
  signup(accountInfo: any) {
    // let seq =  this.http.get('http://localhost:8080/MyLearnApp/signup?'+ this.getUrlParam(accountInfo),{}).share();
    let seq =  this.http.get('http://182.61.12.39:8080/MyLearnApp/signup?'+ this.getUrlParam(accountInfo),{}).share();
    // let seq =  this.http.get('https://mylearnappus.mybluemix.net/MyLearnApp/signup?'+ this.getUrlParam(accountInfo),{}).share();
    seq
      .map(res => res.json())
      .subscribe(data => {
            if (data.message == 'success'){
              this.user = data.user;
              this.save();
            } else {
              this.user = null;
              this.errorMessage = data.message;  
            }
        }, error => {
            // console.log(JSON.stringify(error));
            // this.errorMessage = JSON.stringify(error);
            this.errorMessage = 'AP Server Access Error';
        });
    return seq;
  }

  load() {
      return this.storage.get(this.USER_KEY).then((value) => {
        if (value) {
          this.user = value;
        } else {
          this.user = null;
        }
      });
  }

  save() {
    this.storage.set(this.USER_KEY, this.user)
  }

}
