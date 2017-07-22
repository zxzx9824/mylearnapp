import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { FTP } from '@ionic-native/ftp';
import { File } from '@ionic-native/file';

/**
 * 
 */
@Injectable()
export class Kategoris {
  private SETTINGS_KEY: string = 'kategoris';
  private LAST_KATEGORI_KEY: string = 'lastActiveKategori';
  lastActiveIndex: number;
  kategorisArray : Array<{ title: string,tasks: any[]}> = [];
  timeFlag:number;
  msTime:number = 12000;    

  //settings: any;

  //_defaults: any;
  _readyPromise: Promise<any>;

  constructor(public http: Http,public storage: Storage,private fTP: FTP,private file: File) {
    //this._defaults = defaults;
  }  

  load() {
      return this.storage.get(this.SETTINGS_KEY).then((value) => {
        if (value) {
          this.kategorisArray = value;
        } else {
          this.kategorisArray = [];
        }
      });
  }

  setRecordPath(tasks:any[]){
    if (!File['installed']()) {
      return
    }    
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

  downloadFile(tasks:any[]){
    if (!FTP['installed']()) {
      return
    }    
    // this.fTP.connect('localhost', 'zhouxiang', '1Qazxsw2')
    this.fTP.connect('182.61.12.39', 'zhouxiang', '1Qazxsw2')
    .then((res: any) => {
      for (var index = 0; index < tasks.length; index++) {
        if (tasks[index].uploadTeacherPath != null){
          this.fTP.download(tasks[index].recordTeacherPath,tasks[index].uploadTeacherPath);
          var writePath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].title + '_t.txt';
          var uploadPath = 'Downloads/wav/teacher/'+ tasks[index].title + '_t.txt';
          this.fTP.download(writePath,uploadPath);
          // .then((res: any) => {
          //   this.file.readAsText(this.file.tempDirectory,tasks[index].title + '_t.txt')
          //   .then((value: string) => {
          //       console.log(value);
          //       tasks[index].teacherAmplitudes = value.split(',');
          //   })
          //   .catch((error: any) => console.log(error));
          // })
          // .catch((error: any) => console.log(error));
        }
        if (tasks[index].uploadStudentPath != null){
          this.fTP.download(tasks[index].recordStudentPath,tasks[index].uploadStudentPath);
          var writePath = this.file.tempDirectory.replace(/^file:\/\//, '') + tasks[index].title + '_s.txt';
          var uploadPath = 'Downloads/wav/student/'+ tasks[index].title + '_s.txt';
          this.fTP.download(writePath,uploadPath);
          // .then((res: any) => {
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

  refresh(){
  //  let seq =  this.http.get('https://mylearnappus.mybluemix.net/MyLearnApp/readfromdbforall',{}).share();
  // let seq =  this.http.get('http://localhost:8080/MyLearnApp/readfromdbforall',{}).share();
  let seq =  this.http.get('http://182.61.12.39:8080/MyLearnApp/readfromdbforall',{}).share();
    seq
      .map(res => res.json())
      .subscribe(data => {
          if (data.message == 'success'){
              // alert(JSON.stringify(data.kategoris));
              this.kategorisArray = data.kategoris;
              // this.kategorisArray.forEach(element => {
              //   this.setRecordPath(element.tasks);
              //   this.downloadFile(element.tasks);
              //   this.setFileAmplitudes(element.tasks);
              // });
              this.save();
              if (this.kategorisArray.length > 0){
                this.setLastActiveIndex(this.kategorisArray.length-1);
              }
          } else {
            // this.errorMessage = data.message;  
          }
      }, error => {
          //console.log(JSON.stringify(error));
          // this.errorMessage = JSON.stringify(error);
      });
    return seq;
  }

  setFileAmplitudes(tasks:any[]){
    if (!File['installed']()) {
      return
    }      
    this.timeFlag = setInterval(() => this.getAmplitudesFromFile(tasks), this.msTime);
    setTimeout(() => this.setStopForFileAmplitude(),(tasks.length) * this.msTime + 2000);        
  }

  setStopForFileAmplitude(){
    clearInterval(this.timeFlag);
    this.save();
  }

  changeToNumber(Amplitudes:any[]){
    Amplitudes.forEach(amplitude => {
      amplitude = Number(amplitude);
    });
  }
  getAmplitudesFromFile(tasks:any[]){
    tasks.forEach(task => {
        if (this.file.checkFile(this.file.tempDirectory,task.title + '_t.txt')){
          this.file.readAsText(this.file.tempDirectory,task.title + '_t.txt')
          .then((valueteacher: string) => {
              task.teacherAmplitudes = valueteacher.split(',');
              this.changeToNumber(task.teacherAmplitudes);
          })
          .catch((error: any) => console.log(error));      
        }    
        if (this.file.checkFile(this.file.tempDirectory,task.title + '_s.txt')){
          this.file.readAsText(this.file.tempDirectory,task.title + '_s.txt')
          .then((valuestudent: string) => {
              task.studentAmplitudes = valuestudent.split(',');
              this.changeToNumber(task.studentAmplitudes);
          })
          .catch((error: any) => console.log(error));      
        }        
    });
  }

  save() {
    this.storage.set(this.SETTINGS_KEY, this.kategorisArray)
  }

  newKategori(kategoriTitle : string) {
    // Add a new kategori
    return {
      title: kategoriTitle,
      tasks: []
    };
  }

  createKategori(kategoriTitle : string) {
    var kategori = this.newKategori(kategoriTitle);
    this.kategorisArray.push(kategori);
    this.save();
    this.setLastActiveIndex(this.kategorisArray.length-1);
//    $scope.selectProject(newProject, $scope.projects.length-1);
  }  

  deleteKategori(kategoriTitle : string) {
    for(var i=0; i < this.kategorisArray.length; i++){
      if(this.kategorisArray[i].title == kategoriTitle){
        this.kategorisArray.splice(i,1);
        i--;
      }
    }  
    this.save();
    this.setLastActiveIndex(this.kategorisArray.length-1);
  }  

  getIndexFromKategoris(kategori : any) {
    for(var i=0; i < this.kategorisArray.length; i++){
      if(this.kategorisArray[i].title == kategori.title){
        return i;
      }
    }  
    return 0;
  }  

  getLastActiveIndex() {
    return this.storage.get(this.LAST_KATEGORI_KEY).then((value) => {
      if (value) {
        this.lastActiveIndex = value;
      } else {
        this.lastActiveIndex = 0;
      }
    });
  }
    
  setLastActiveIndex(index : any) {
    this.storage.set(this.LAST_KATEGORI_KEY, index);
  }

}
