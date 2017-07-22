import { Component, ViewChild } from '@angular/core';
//import { Nav, Platform } from 'ionic-angular';
import { Platform, Nav, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
//import { ListPage } from '../pages/list/list';

import { Kategoris } from '../providers/kategoris';
import { User } from '../providers/user';
import { TranslateService } from '@ngx-translate/core'
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = WelcomePage;
  kategoris: Array<{ title: string,tasks: any[]}> = [];

  // kategoris: Kategoris;

//  pages: Array<{title: string, component: any}>;

  constructor(private translate: TranslateService,public platform: Platform, public kategorisPro: Kategoris, public statusBar: StatusBar, public splashScreen: SplashScreen,public UserPro:User,private config: Config,
  private alertCtrl: AlertController) {
    // this.UserPro.load().then(() => {
    //   if (this.UserPro.activeUser != null) {
    //       this.kategorisPro.load().then(() => {
    //         this.kategoris = this.kategorisPro.kategorisArray;
    //        });
    //   }
    // });
    this.kategorisPro.refresh().subscribe((resp) => {
      if (this.kategorisPro.kategorisArray.length != 0) {
        this.kategoris = this.kategorisPro.kategorisArray;
      }else{
      }
    }, (err) => {
    });

    this.initTranslate();
//    this.kategoris = [];

    // this.UserPro.load().then(() => {
    //   if (UserPro.activeUser != null) {
    //     // Okay, so the platform is ready and our plugins are available.
    //     // Here you can do any higher level native things you might need.
    //     if(this.kategorisPro.kategorisArray.length == 0) {
    //       var kategoriTitle = prompt('Your first kategori');
    //       if(kategoriTitle) {
    //         this.kategorisPro.createKategori(kategoriTitle);
    //       }
    //     }
    //     this.kategoris = this.kategorisPro.kategorisArray;
    //   }
    // });
//    this.kategorisPro.createKategori('test2');
//    this.kategorisPro.createKategori('test3');
  

    // used for an example of ngFor and navigation
//    this.pages = [
//      { title: 'Home', component: HomePage },
//      { title: 'List', component: ListPage }
//    ];

  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ionViewDidEnter() {
    // // the root left menu should be disabled on the tutorial page
    // this.UserPro.load().then(() => {
    //   if (this.UserPro.activeUser != null) {
    //       this.kategorisPro.load().then(() => {
    //         this.kategoris = this.kategorisPro.kategorisArray;
    //        });
    //   }
    // });
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Okay, so the platform is ready and our plugins are available.
  //     // Here you can do any higher level native things you might need.
  //     this.statusBar.styleDefault();
  //     this.splashScreen.hide();
  //   });
  // }

  removeKategori(){
    let prompt = this.alertCtrl.create({
      title: 'REMOVE KATEGORI',
      message: "remove your kategori please",
      inputs: [
        {
          name: 'kategoriName',
          placeholder: 'Kategori Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Remove',
          handler: data => {
            if(data) {
              this.kategorisPro.deleteKategori(data.kategoriName);
            }  
            this.kategoris = this.kategorisPro.kategorisArray;
          }
        }
      ]
    });
    prompt.present();    
      // var kategoriTitle = prompt('remove your kategori please');
      // if(kategoriTitle) {
      //   this.kategorisPro.deleteKategori(kategoriTitle);
      // }  
      // this.kategoris = this.kategorisPro.kategorisArray;
  }

  addKategori(){
    let prompt = this.alertCtrl.create({
      title: 'ADD KATEGORI',
      message: "add your kategori please",
      inputs: [
        {
          name: 'kategoriName',
          placeholder: 'Kategori Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
            if(data) {
              this.kategorisPro.createKategori(data.kategoriName);
            }  
            this.kategoris = this.kategorisPro.kategorisArray;
          }
        }
      ]
    });
    prompt.present();
  
    // var kategoriTitle = prompt('add your kategori please');
    // if(kategoriTitle) {
    //   this.kategorisPro.createKategori(kategoriTitle);
    // }  
    // this.kategoris = this.kategorisPro.kategorisArray;
  }

  openPage(kategori : any) {
     this.kategorisPro.setLastActiveIndex(this.kategorisPro.getIndexFromKategoris(kategori)); 
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(HomePage,{
      kategori: kategori
    });
  }
}
