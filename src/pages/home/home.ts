import { Component } from '@angular/core';
import { ToastController,ModalController,NavController,Platform, NavParams, ViewController} from 'ionic-angular';
import { Kategoris } from '../../providers/kategoris';
import { User } from '../../providers/user';
import { Storage } from '@ionic/storage';
 import { Http } from '@angular/http';
 import { LoginPage } from '../login/login';
 import { TaskDetailPage } from '../task-detail/task-detail';
 import { FTP } from '@ionic-native/ftp';
 import { File } from '@ionic-native/file';
 import { LoadingController } from 'ionic-angular';
//  import { IWriteOptions } from '@ionic-native/file'; 

//import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activeKategori: {title:string, tasks: any[]} 
   = {
    title: '',
    tasks: []
  };
  acitiveUser: { name: string, password: string, authority: any} = {
    name: '',
    password: '',
    authority: 0
  };
  // iWriteOptions:IWriteOptions;
  //activeKategori:any;
  // selectedtask:any;
  // transferStatus:any;
  // tasks: Array<{title: string}>;
  timeFlag:number;
  msTime:number = 7000;    

  constructor(public navCtrl: NavController,
      public toastCtrl: ToastController,
  public modalCtrl: ModalController,public navParams: NavParams,public kategorisPro: Kategoris,public storage:Storage,private http: Http
  ,private fTP: FTP,private file: File,public user: User,public loadingCtrl: LoadingController) {

   if (navParams.get('kategori') != null){
     this.activeKategori = navParams.get('kategori');
     return;
     
   }
   //prompt(String(this.kategorisPro.getLastActiveIndex()));
   //prompt(index);
//    this.storage.get('lastActiveKategori').then((val) => {
//      prompt(val);
//    });


//    this.activeKategori = this.kategorisPro.all()[this.kategorisPro.getLastActiveIndex()];

//    this.storage.get('lastActiveKategori').then((val) => {
//      prompt(val);
//    });
    this.kategorisPro.load().then(() => {
      if(this.kategorisPro.kategorisArray.length == 0) {
        var kategoriTitle = prompt('Your first kategori');
        if(kategoriTitle) {
          this.kategorisPro.createKategori(kategoriTitle);
        }
      }
      this.kategorisPro.getLastActiveIndex().then(() => {
        this.activeKategori = this.kategorisPro.kategorisArray[this.kategorisPro.lastActiveIndex];
      });
    });

//    this.tasks = [];
//    for (let i = 1; i < 11; i++) {
//      this.tasks.push({
//        title: 'Item ' + i
//      });
//    }
  }

  getUrlParam(obj: any) {
    var str =[];
    for (var p in obj){
      if(obj[p].constructor == Array){
        var childTitles =[];
        var childContents =[];
        for (var cp in obj[p][0]){
          if ( cp.lastIndexOf('hashKey') == -1) {
            childTitles.push(encodeURIComponent(cp));
            var contents =[];
            for(var i = 0; i < obj[p].length;i++){
              contents.push(encodeURIComponent(obj[p][i][cp]));
            }
            childContents.push(contents);
          }
        }
        for(var i = 0; i < childTitles.length;i++){
          str.push(p + "_"+ encodeURIComponent(childTitles[i]) + "=" + childContents[i].join(",").toString());
        }
        // str.push(encodeURIComponent(p) + "=" + childstr.join(",").toString());
        //  var childTitles =[];
        //  var childContents =[[]];
        //  for(var j = 0; j < obj[p].length;j++){
        //     for (var cp in obj[p][j]){
        //       if ( cp.lastIndexOf('hashKey') == -1) {
        //         if (j==0) {
        //           childTitles.push(encodeURIComponent(cp));
        //         } 

        //       }
        //       if ( cp.lastIndexOf('hashKey') == -1) {
        //          childstr.push(encodeURIComponent(obj[p][j][cp]));
        //       } 
        //     }
        //  }
        //  str.push(encodeURIComponent(p) + "=" + childstr.join(",").toString());
      } else if ( p.lastIndexOf('hashKey') == -1) {
         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      } 
    }
    return str.join("&").toString();
  }

  logOut(){
      this.navCtrl.popToRoot();
      this.navCtrl.push(LoginPage);
  }

  toastDisplay(msg: any){
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
  }

  // fileUpload(path : string, kategori: any){
  //   var fileNm = path.split('/')[path.split('/').length-1]
  //   var fileUploadPath;
  //   if(kategori == 't'){
  //     fileUploadPath = 'Downloads/wav/teacher/'+ fileNm;
  //   }else{
  //     fileUploadPath = 'Downloads/wav/student/'+ fileNm;
  //   }
  //   this.fTP.upload(path,fileUploadPath);
  //   return fileUploadPath;
  // }

  setUploadPath(tasks:any[]){
      for (var index = 0; index < tasks.length; index++) {
        if (tasks[index].recordTeacherPath != null){
            tasks[index].uploadTeacherPath = 'Downloads/wav/teacher/'+ tasks[index].recordTeacherPath.split('/')[tasks[index].recordTeacherPath.split('/').length-1]
        }else{
          tasks[index].uploadTeacherPath = null;
        } 
        if (tasks[index].recordStudentPath != null){
            tasks[index].uploadStudentPath = 'Downloads/wav/student/'+ tasks[index].recordStudentPath.split('/')[tasks[index].recordStudentPath.split('/').length-1]
        }else{
          tasks[index].uploadStudentPath = null;
        } 
      }
  }

  setRecordPath(tasks:any[]){
      for (var index = 0; index < tasks.length; index++) {
        if (tasks[index].uploadTeacherPath != null){
            tasks[index].recordTeacherPath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].uploadTeacherPath.split('/')[tasks[index].uploadTeacherPath.split('/').length-1]
        }else{
          tasks[index].recordTeacherPath = null;
        } 
        if (tasks[index].uploadStudentPath != null){
            tasks[index].recordStudentPath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].uploadStudentPath.split('/')[tasks[index].uploadStudentPath.split('/').length-1]
        }else{
          tasks[index].recordStudentPath = null;
        } 
      }
  }

  uploadFile(tasks:any[]){
    // this.fTP.connect('localhost', 'zhouxiang', '1Qazxsw2')
    this.fTP.connect('182.61.12.39', 'administrator', 'ZAQ!2wsx')
    .then((res: any) => {
      for (var index = 0; index < tasks.length; index++) {
        if (tasks[index].recordTeacherPath != null){
          // this.fileUpload(tasks[index].recordTeacherPath,'t');
          this.fTP.upload(tasks[index].recordTeacherPath,tasks[index].uploadTeacherPath);
        }
        if (tasks[index].recordStudentPath != null){
          // this.fileUpload(tasks[index].recordStudentPath,'s');
          this.fTP.upload(tasks[index].recordStudentPath,tasks[index].uploadStudentPath);
        }
      }
    })
    .catch((error: any) => console.log(error));
    this.fTP.disconnect();  
  }

 createUploadFileAmplitudes(tasks:any[]){
    // this.fTP.connect('localhost', 'zhouxiang', '1Qazxsw2')
    this.fTP.connect('182.61.12.39', 'administrator', 'ZAQ!2wsx')
    .then((res: any) => {
        for (var index = 0; index < tasks.length; index++) {
          if (tasks[index].teacherAmplitudes != null){
            var writePath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].title + '_t.txt';
            var uploadPath = 'Downloads/wav/teacher/'+ tasks[index].title + '_t.txt';
            this.fTP.upload(writePath,uploadPath);
          }
          if (tasks[index].studentAmplitudes != null){
            var writePath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].title + '_s.txt';
            var uploadPath = 'Downloads/wav/student/'+ tasks[index].title + '_s.txt';
            this.fTP.upload(writePath,uploadPath);
          }
        }
    })
    .catch((error: any) => console.log(error));
    this.fTP.disconnect();  
 }
  getValidateTask(tasks:any[]){
    var validate = 0;
    for (var index = 0; index < tasks.length; index++) {
      if (tasks[index].uploadTeacherPath != null){
        validate++;
      }
      if (tasks[index].uploadStudentPath != null){
        validate++;
      }
    }
    return validate;
  }
  
  setFileAmplitudes(tasks:any[]){
    var circle = this.getValidateTask(tasks);
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: (circle) * this.msTime + 2000
    });
    loader.present();    
    this.timeFlag = setInterval(() => this.getAmplitudesFromFile(tasks), this.msTime);
    setTimeout(() => this.setStopForFileAmplitude(),(circle) * this.msTime + 2000);        
  }

  setStopForFileAmplitude(){
    clearInterval(this.timeFlag);
    this.kategorisPro.save();
    this.toastDisplay('File download succeccfully');
  }

  getAmplitudesFromFile(tasks:any[]){
    tasks.forEach(task => {
      this.file.checkFile(this.file.tempDirectory,task.title + '_t.txt')
        .then((res: any) => {
            this.file.readAsText(this.file.tempDirectory,task.title + '_t.txt')
            .then((valueteacher: string) => {
                task.teacherAmplitudes = valueteacher.split(',');
            })
            .catch((error: any) => console.log(error));      
          })
          .catch((error: any) => console.log(error));      
      this.file.checkFile(this.file.tempDirectory,task.title + '_s.txt')
        .then((res: any) => {
            this.file.readAsText(this.file.tempDirectory,task.title + '_s.txt')
            .then((valuestudent: string) => {
                task.studentAmplitudes = valuestudent.split(',');
            })
            .catch((error: any) => console.log(error));      
          })
          .catch((error: any) => console.log(error));      
      
        // if (this.file.checkFile(this.file.tempDirectory,task.title + '_t.txt')){
        //   this.file.readAsText(this.file.tempDirectory,task.title + '_t.txt')
        //   .then((valueteacher: string) => {
        //       task.teacherAmplitudes = valueteacher.split(',');
        //   })
        //   .catch((error: any) => console.log(error));      
        // }    
        // if (this.file.checkFile(this.file.tempDirectory,task.title + '_s.txt')){
        //   this.file.readAsText(this.file.tempDirectory,task.title + '_s.txt')
        //   .then((valuestudent: string) => {
        //       task.studentAmplitudes = valuestudent.split(',');
        //   })
        //   .catch((error: any) => console.log(error));      
        // }        
    });
      // for (var index = 0; index < tasks.length; index++) {
      //   if (this.file.checkFile(this.file.tempDirectory,tasks[index].title + '_t.txt')){
      //     this.file.readAsText(this.file.tempDirectory,tasks[index].title + '_t.txt')
      //     .then((valueteacher: string) => {
      //         tasks[index].teacherAmplitudes = valueteacher.split(',');
      //         alert(tasks[index].teacherAmplitudes[0]);
      //     })
      //     .catch((error: any) => console.log(error));      
      //   }    
      //   if (this.file.checkFile(this.file.tempDirectory,tasks[index].title + '_s.txt')){
      //     this.file.readAsText(this.file.tempDirectory,tasks[index].title + '_s.txt')
      //     .then((valuestudent: string) => {
      //         tasks[index].studentAmplitudes = valuestudent.split(',');
      //         alert(tasks[index].studentAmplitudes[0]);
      //     })
      //     .catch((error: any) => console.log(error));      
      //   }        
      // }
  }

  downloadFile(tasks:any[]){
    // this.fTP.connect('localhost', 'zhouxiang', '1Qazxsw2')
    this.fTP.connect('182.61.12.39', 'administrator', 'ZAQ!2wsx')
    .then((res: any) => {
      for (var index = 0; index < tasks.length; index++) {
        if (tasks[index].uploadTeacherPath != null){
          // this.fileUpload(tasks[index].recordTeacherPath,'t');
          this.fTP.download(tasks[index].recordTeacherPath,tasks[index].uploadTeacherPath);
          var writePath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].title + '_t.txt';
          var uploadPath = 'Downloads/wav/teacher/'+ tasks[index].title + '_t.txt';
          this.fTP.download(writePath,uploadPath);
          //  .then((res: any) => {
          //   this.file.readAsText(this.file.tempDirectory,tasks[index].title + '_t.txt')
          //   .then((value: string) => {
          //       alert(value);
          //       tasks[index].teacherAmplitudes = value.split(',');
          //   })
          //   .catch((error: any) => console.log(error));
          // })
          // .catch((error: any) => console.log(error));          
        }
        if (tasks[index].uploadStudentPath != null){
          // this.fileUpload(tasks[index].recordStudentPath,'s');
          this.fTP.download(tasks[index].recordStudentPath,tasks[index].uploadStudentPath);
          var writePath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].title + '_s.txt';
          var uploadPath = 'Downloads/wav/student/'+ tasks[index].title + '_s.txt';
          this.fTP.download(writePath,uploadPath);
          //.then((res: any) => {
          //   this.file.readAsText(this.file.tempDirectory,tasks[index].title + '_s.txt')
          //   .then((value: string) => {
          //       console.log(value);
          //       tasks[index].studentAmplitudes = value.split(',');
          //   })
          //   .catch((error: any) => console.log(error));
        // })
          // .catch((error: any) => console.log(error));
        }
      }
    })
    .catch((error: any) => console.log(error));
    this.fTP.disconnect();
  }

  uploadTask() {
    // this.file.createFile(this.file.tempDirectory,'test.txt',true).then((res: any) => {
    //   console.log(res);
    // })
    // .catch((error: any) => console.log(error));
    
    if (FTP['installed']() && File['installed']()) {
      this.setUploadPath(this.activeKategori.tasks);
      this.uploadFile(this.activeKategori.tasks);
      this.createUploadFileAmplitudes(this.activeKategori.tasks);
    }  

    // alert(JSON.stringify(this.activeKategori));
    // alert(this.getUrlParam(this.activeKategori));
      this.http
      // .get('http://localhost:8080/MyLearnApp/upload?'+ this.getUrlParam(this.activeKategori),
      .get('http://182.61.12.39:8080/MyLearnApp/upload?'+ this.getUrlParam(this.activeKategori),
      // .get('https://mylearnappus.mybluemix.net/MyLearnApp/upload?'+ this.getUrlParam(this.activeKategori),
      
          {})
          .subscribe(data => {
            this.toastDisplay(data.json().message);
          }, error => {
            this.toastDisplay('AP Server Access Error');
            //this.toastDisplay(JSON.stringify(error.json()));
          });
  }

  downloadTask() {

      this.http
      // .get('http://localhost:8080/MyLearnApp/readfromdb?'+ this.getUrlParam(this.activeKategori),
      .get('http://182.61.12.39:8080/MyLearnApp/readfromdb?'+ this.getUrlParam(this.activeKategori),
      // .get('https://mylearnappus.mybluemix.net/MyLearnApp/readfromdb?'+ this.getUrlParam(this.activeKategori),
          {})
          .subscribe(data => {
            this.activeKategori.tasks = data.json().tasks;
            if (FTP['installed']() && File['installed']()) {
              this.setRecordPath(this.activeKategori.tasks);
              this.downloadFile(this.activeKategori.tasks);
              this.setFileAmplitudes(this.activeKategori.tasks);
            }  
            this.kategorisPro.save();
            this.toastDisplay(data.json().message);
          }, error => {
            this.toastDisplay('AP Server Access Error');
            // this.toastDisplay(JSON.stringify(error.json()));
          });
  }  

  deleteTask(task) {
    for(var i=0; i < this.activeKategori.tasks.length; i++){
      if(this.activeKategori.tasks[i].title == task.title){
        this.activeKategori.tasks.splice(i,1);
        this.kategorisPro.save();
        return;
      }
    }  
  }

 newTask(){
    let modal = this.modalCtrl.create(ModalContentPage);
    modal.onDidDismiss(task => {
      if (task) {
    		this.activeKategori.tasks.push({
    			title: task.title,
          pass:0,
          recordTeacherPath:null,
          recordStudentPath:null,
          uploadTeacherPath:null,
          uploadStudentPath:null,
          teacherAmplitudes:null,
          studentAmplitudes:null
    		});
        this.kategorisPro.save();
      //  alert(JSON.stringify(this.kategorisPro.kategorisArray));
      //  alert(JSON.stringify(this.activeKategori));
      }
    })
    
    modal.present();
 }

  /**
   * Navigate to the detail page for this item.
   */
  openTask(task: any) {
    // if (this.file.checkFile(this.file.tempDirectory,task.title + '_t.txt')){
    //   this.file.readAsText(this.file.tempDirectory,task.title + '_t.txt')
    //   .then((valueteacher: string) => {
    //       task.teacherAmplitudes = valueteacher.split(',');
    //   })
    //   .catch((error: any) => console.log(error));      
    // }    
    // if (this.file.checkFile(this.file.tempDirectory,task.title + '_s.txt')){
    //   this.file.readAsText(this.file.tempDirectory,task.title + '_s.txt')
    //   .then((valuestudent: string) => {
    //       task.studentAmplitudes = valuestudent.split(',');
    //   })
    //   .catch((error: any) => console.log(error));      
    // }       
    this.navCtrl.push(TaskDetailPage, {
      task: task
    });
  } 

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.kategorisPro.save();
    this.user.load().then(() => {
      this.acitiveUser = this.user.user;
    });
  }
}

@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Edit Task
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary">Cancel</span>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>
      <ion-item>
        <ion-input type="text" [(ngModel)]="task.title" placeholder="What task do you want to add?"></ion-input>
      </ion-item>
      <button ion-button (click)="createTask(task)">
        Create
      </button>
  </ion-list>
</ion-content>
`
})
export class ModalContentPage {
  task: { title: string } = {
    title: ''
  };

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  createTask(task) {
    this.viewCtrl.dismiss(task);
  }  
}