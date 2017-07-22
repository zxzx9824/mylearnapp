import { Component } from '@angular/core';
import { MenuController, NavController, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, password: string, authority: any} = {
    name: '',
    password: '',
    authority: false
  };

  // Our translated text strings
  // private signupErrorString: string;

  constructor(public menu: MenuController, 
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

//    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
//      this.signupErrorString = value;
//    })
  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {
      if (this.user.user != null) {
        this.navCtrl.push(HomePage);
      }else{
        let toast = this.toastCtrl.create({
          message: this.user.errorMessage,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => {

//      this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.user.errorMessage,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }   
}
