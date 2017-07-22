import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule} from '@ionic/storage';
import { HttpModule ,Http } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ModalContentPage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TaskDetailPage } from '../pages/task-detail/task-detail';


import { Kategoris } from '../providers/kategoris';
import { User } from '../providers/user';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MediaPlugin} from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';

import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";


// export function provideKategoris(storage: Storage) {
//   /**
//    * The Settings provider takes a set of default settings for your app.
//    *
//    * You can add new settings options at any time. Once the settings are saved,
//    * these values will not overwrite the saved values (this can be done manually if desired).
//    */
//   return new Kategoris(storage);
// }
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function providers() {
  return [
    Kategoris,
    User,
    MediaPlugin,
    File,
    NgbProgressbarConfig,
    NgbProgressbar,
    SplashScreen,
    StatusBar,
    FTP,
    // { provide: Kategoris, useFactory: provideKategoris, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WelcomePage,
    LoginPage,
    SignupPage,
    TaskDetailPage,
    ModalContentPage,
    NgbProgressbar
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NgbProgressbar,
    HomePage,
    WelcomePage,
    LoginPage,
    SignupPage,
    TaskDetailPage,
    ModalContentPage
  ],
  providers: providers()
})
export class AppModule {}
