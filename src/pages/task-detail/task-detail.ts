import { Component,ViewChild} from '@angular/core';
import { MenuController,NavController, NavParams,ToastController } from 'ionic-angular';

import { MediaPlugin,MediaObject} from '@ionic-native/media';
import { File } from '@ionic-native/file';
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
// import {NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";
import { IWriteOptions } from '@ionic-native/file'; 
import { User } from '../../providers/user';

@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html'
})
export class TaskDetailPage {
  @ViewChild('fileInput') fileInput;  
  // progressBar:NgbProgressbar
  teacherfile: MediaObject; 
  studentfile: MediaObject;
  iWriteOptions: IWriteOptions;
  task: any;
  timeFlag:number;
  // scores: any[];
  // teacherActiveMedia : MediaFile;
  // studentActiveMedia : MediaFile;
  // directory : string = '../../assets/media/';
  teacherAmplitudes:any[];
  studentAmplitudes:any[];
  progress:number;
  msTime:number = 100;  
  score:any = 0;
  acitiveUser: { name: string, password: string, authority: any} = {
    name: '',
    password: '',
    authority: 0
  };  
  constructor(public navCtrl: NavController, navParams: NavParams,public menu:MenuController,
  private media: MediaPlugin, private file: File,
  public config:NgbProgressbarConfig,public toastCtrl: ToastController,public user: User) {
    this.task = navParams.get('task');
    this.score=0;
    config.max = (this.task.title.length + 10)*10
    config.showValue = false;
    config.striped = true;
    config.animated = true;
    config.type = 'success';   
    this.teacherAmplitudes = this.task.teacherAmplitudes;
    this.studentAmplitudes = this.task.studentAmplitudes;
      // this.file.checkFile(this.file.dataDirectory,'/tmp/test').then(_ =>{ 
      // alert('deletefile');this.file.removeFile(this.file.dataDirectory,'/tmp/test');}).catch(err => 
      // alert(JSON.stringify(err.json)));
  }

recordForTeacher(){
    if (!MediaPlugin['installed']() || !File['installed']()) {
      return
    }  
    this.teacherfile = this.createMediaFile('t');
    this.progress=0;
    this.teacherAmplitudes=[];
    this.teacherfile.startRecord();
    this.timeFlag = setInterval(() => this.dynamicChange(this.teacherfile,this.teacherAmplitudes), this.msTime);
}

stopRecordForTeacher(){
  if(this.teacherfile == null){
    return;
  }
  clearInterval(this.timeFlag);
  this.teacherfile.stopRecord();
  this.arrangeLowAmplitude(this.teacherAmplitudes);
  this.task.teacherAmplitudes = this.teacherAmplitudes;
  this.file.checkFile(this.file.tempDirectory,this.task.title + '_t.txt')
    .then((res: any) => {
      this.file.removeFile(this.file.tempDirectory,this.task.title + '_t.txt')
      .then((res: any) => {
        this.file.writeFile(this.file.tempDirectory,this.task.title + '_t.txt',this.task.teacherAmplitudes.join(','));
      })
      .catch((error: any) => console.log(error));
    })
    .catch((error: any) =>this.file.writeFile(this.file.tempDirectory,this.task.title + '_t.txt',this.task.teacherAmplitudes.join(',')));
 
  // if (this.file.checkFile(this.file.tempDirectory,this.task.title + '_t.txt')){
  //   this.file.removeFile(this.file.tempDirectory,this.task.title + '_t.txt')
  //   .then((res: any) => {
  //     this.file.writeFile(this.file.tempDirectory,this.task.title + '_t.txt',this.task.teacherAmplitudes.join(','));
  //   })
  //   .catch((error: any) => console.log(error));
  // }else{
  //   this.file.writeFile(this.file.tempDirectory,this.task.title + '_t.txt',this.task.teacherAmplitudes.join(','));
  // }
}

playForTeacher(){
  if(this.task.recordTeacherPath == null){
    return;
  }

  if (this.teacherfile == null){
    this.teacherfile = this.createMediaFile('t');
  }
  
  this.progress=0;
  this.teacherfile.play();
  this.timeFlag = setInterval(() => this.dynamicChangeNoPush(), this.msTime);
  setTimeout(() => clearInterval(this.timeFlag),(this.config.max/5) * this.msTime);
}
recordForStudent(){
    if (!MediaPlugin['installed']() || !File['installed']()) {
      return
    }    
    this.studentfile = this.createMediaFile('s');
    this.progress=0;
    this.studentAmplitudes=[];
    this.studentfile.startRecord();
    this.timeFlag = setInterval(() => this.dynamicChange(this.studentfile,this.studentAmplitudes), this.msTime);
}
stopRecordForStudent(){
  if(this.studentfile == null){
    return;
  }
  clearInterval(this.timeFlag);
  this.studentfile.stopRecord();
  this.arrangeLowAmplitude(this.studentAmplitudes);
  this.task.studentAmplitudes = this.studentAmplitudes;
  this.file.checkFile(this.file.tempDirectory,this.task.title + '_s.txt')
    .then((res: any) => {
      this.file.removeFile(this.file.tempDirectory,this.task.title + '_s.txt')
      .then((res: any) => {
        this.file.writeFile(this.file.tempDirectory,this.task.title + '_s.txt',this.task.studentAmplitudes.join(','));
      })
      .catch((error: any) => console.log(error));
    })
    .catch((error: any) =>this.file.writeFile(this.file.tempDirectory,this.task.title + '_s.txt',this.task.studentAmplitudes.join(',')));
  
  // if (this.file.checkFile(this.file.tempDirectory,this.task.title + '_s.txt')){
  //   this.file.removeFile(this.file.tempDirectory,this.task.title + '_s.txt')
  //   .then((res: any) => {
  //       this.file.writeFile(this.file.tempDirectory,this.task.title + '_s.txt',this.task.studentAmplitudes.join(','));
  //   })
  //   .catch((error: any) => console.log(error));
  // }else{
  //   this.file.writeFile(this.file.tempDirectory,this.task.title + '_s.txt',this.task.studentAmplitudes.join(','));
  // }
}
playForStudent(){
  if(this.task.recordStudentPath == null){
    return;
  }
  if (this.studentfile == null){
    this.studentfile = this.createMediaFile('s');
  }
  this.progress=0;
  this.studentfile.play();
  this.timeFlag = setInterval(() => this.dynamicChangeNoPush(), this.msTime);
  setTimeout(() => clearInterval(this.timeFlag),(this.config.max/5) * this.msTime);  
}

dynamicChangeNoPush() {
    this.progress += 6;
    if (this.progress > this.config.max) this.progress = this.config.max;
}

dynamicChange(mediaFile:MediaObject,amplitudes:any[]) {
    this.progress += 6;
      mediaFile.getCurrentAmplitude().then(
        (value : any) => {amplitudes.push(value)
      })        
    if (this.progress > this.config.max) this.progress = this.config.max;
}

createMediaFile(authority:string){
    const onStatusUpdate = (status) => console.log(status);
    const onSuccess = () => console.log('Action is successful.');
    const onError = (error) => console.error(error.message);
    const path = this.file.tempDirectory.replace(/^file:\/\//, '') + this.task.title + '_'+ authority +'.wav';
    if (authority=='t'){
      this.task.recordTeacherPath = path;
    }else{
      this.task.recordStudentPath = path;
    }
    return this.media.create(path, onStatusUpdate, onSuccess, onError);
}

evulate(){
  var tDiffAmplitudes:any[] =[];
  var sDiffAmplitudes:any[] = [];
  var diffLength: number;
  var diffAll: number = 0;

 if(this.teacherAmplitudes ==null || this.studentAmplitudes ==null){
   this.toastDisplay('Please Record First');
   return;
 }
 if(this.teacherAmplitudes.length == 0 || this.studentAmplitudes.length ==0){
   this.toastDisplay('Please Record First');
   return;
 }

// this.teacherAmplitudes =[];
// this.teacherAmplitudes.push(0.1);
// this.teacherAmplitudes.push(0.2);
// this.teacherAmplitudes.push(0.3);
// this.teacherAmplitudes.push(0.2);
// this.teacherAmplitudes.push(0.1);
// this.teacherAmplitudes.push(0.3);
// this.teacherAmplitudes.push(0.2);
// this.teacherAmplitudes.push(0.4);
// this.teacherAmplitudes.push(0.2);
// this.teacherAmplitudes.push(0.2);

// this.studentAmplitudes =[];
// this.studentAmplitudes.push(0);
// this.studentAmplitudes.push(0.1);
// this.studentAmplitudes.push(0.2);
// this.studentAmplitudes.push(0.1);
// this.studentAmplitudes.push(0.1);
// this.studentAmplitudes.push(0.2);
// this.studentAmplitudes.push(0.1);
// this.studentAmplitudes.push(0.2);
// this.studentAmplitudes.push(0.1);
// this.studentAmplitudes.push(0.2);
// this.studentAmplitudes.push(0.1);
// this.studentAmplitudes.push(0.2);

  // this.arrangeLowAmplitude(this.teacherAmplitudes);
  // this.arrangeLowAmplitude(this.studentAmplitudes);

  for (var index = 1; index < this.teacherAmplitudes.length; index++) {
    tDiffAmplitudes.push(Number(this.teacherAmplitudes[index]) - Number(this.teacherAmplitudes[index-1]));
  }

  for (var index = 1; index < this.studentAmplitudes.length; index++) {
    sDiffAmplitudes.push(Number(this.studentAmplitudes[index]) - Number(this.studentAmplitudes[index-1]));
  }

  diffLength = tDiffAmplitudes.length > sDiffAmplitudes.length 
      ? tDiffAmplitudes.length:sDiffAmplitudes.length;
  for (var index = 1; index < diffLength; index++) {
    if (index >= tDiffAmplitudes.length){
        diffAll+= Math.abs(sDiffAmplitudes[index]);
    }else if (index >= sDiffAmplitudes.length){
        diffAll+= Math.abs(tDiffAmplitudes[index]);
    } else {
      diffAll+= Math.abs((sDiffAmplitudes[index] - tDiffAmplitudes[index]));
    }
  }  

  var temp:number = diffAll - this.task.title.length * 0.15;
  if (temp < 0){
      this.score = 100;
  }else{
    temp = 1 - temp;
    if (temp < 0){
        this.score = 0;
        this.toastDisplay('Your score is too low... please try again~');
    }else{
        this.score = temp*100;
    }    
  }

  // console.log(diffAll.toFixed(2));
  // alert(diffAll);

  // var teacherDiff:number = 0;
  // for (var index = 0; index < tDiffAmplitudes.length; index++) {
  //   teacherDiff+= Math.abs(tDiffAmplitudes[index]);
  // }
  
  var teacherScore:number = 0;
  for (var index = 0; index < this.teacherAmplitudes.length; index++) {
    teacherScore+= Number(this.teacherAmplitudes[index]);
  }
  var studentScore:number = 0;
  for (var index = 0; index < this.studentAmplitudes.length; index++) {
    studentScore+= Number(this.studentAmplitudes[index]);
  }
  // console.log('teacher score');
  // console.log(teacherScore.toFixed(2));
  // console.log('student score');
  // console.log(studentScore.toFixed(2));
  
  if(studentScore/teacherScore > 1.35){
    this.score =0;
    this.toastDisplay('You said too loud or too more, please try again~');
  }else if(teacherScore/studentScore > 1.35){
    this.score =0;
    this.toastDisplay('You said too low or too little, please try again~');
  }

  if (this.score!=0){
    temp = teacherScore/studentScore;
    if(temp > 1){
      temp = 1/temp;
    }
    this.score = this.score * 0.8 + temp* 100 * 0.2;
  }

  // var tempScore:number = teacherScore/studentScore;
  // if(tempScore > 1){
  //   tempScore = 1/tempScore;
  // }
  // this.score = (1 - diffAll/teacherDiff)*100;
  this.task.pass = 0;
  if(this.score > 60){
    this.task.pass = 1;
    this.toastDisplay('Your Score '+ this.score.toFixed(0)+'!,Congratulations~');
  }else if(this.score != 0){
    this.toastDisplay('Your Score '+ this.score.toFixed(0)+'!,Try Once More~');
  }
}

arrangeLowAmplitude(amplitudes: any[]){
  for (var index = 0; index < amplitudes.length; index++) {
    if (amplitudes[index] < 0.04){
      amplitudes[index] = 0;
    }
  }
}
  toastDisplay(msg: any){
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'middle'
      });
      toast.present();
  }
// startRecord(){
//   // this.scores =[];
//   console.log('Start');
//       this.progress=0;
//   // this.timeFlag = setInterval(() => this.dynamicChange(), this.msTime);
//   //  this.teacherfile.startRecord();
//   //   // this.timeFlag = setInterval(()=>{alert(1)},1000);
//   //     this.timeFlag = setInterval(()=>{this.teacherfile.getCurrentAmplitude().then(
//   //       (value : any) => {console.log(value)
//   //       })},100);

// }

// // stopRecord(){
// //   console.log('Stop');
// //   // this.startRecordFlg = false;
// //    this.teacherfile.stopRecord();
// //   clearInterval(this.timeFlag);
// // }

// pauseRecord(){
//   this.teacherfile.pauseRecord();
// }
// resumeRecord(){
//   this.teacherfile.resumeRecord();
// }

//   pause(){
//     this.teacherfile.pause();
//   }
//   stop(){
//     this.teacherfile.stop();
//   }
//   goSeek(){
//     this.teacherfile.seekTo(1000);
//   }
//   getDuration(){
//     console.log(this.teacherfile.getDuration());
//   }
//   getCurrentPosition(){
//     this.teacherfile.getCurrentPosition().then(
//         (value : any) => {console.log(value)
//         });    
//     console.log(this.teacherfile.getCurrentPosition);
//     console.log(this.teacherfile.getCurrentPosition());
//   }
//   getamp(){
//     this.teacherfile.getCurrentAmplitude().then(
//         (value : any) => {console.log(value)
//         });    
//     console.log(this.teacherfile.getCurrentAmplitude);
//     console.log(this.teacherfile.getCurrentAmplitude());
//   }

//   evulate(){
//     this.teacherfile.play();
//     // if (this.teacherActiveMedia ==null){
//     //   return
//     // }

//     // // if (this.studentActiveMedia ==null){
//     // //   return
//     // // }

//     // const onTeacherStatusUpdate = (status) => console.log(status);
//     // const onTeacherSuccess = () => console.log('Action is successful.');
//     // const onTeacherError = (error) => console.error(error.message);

//     // this.teacherfile = this.media.create(this.teacherActiveMedia.fullPath, onTeacherStatusUpdate, onTeacherSuccess, onTeacherError);

//     // // const onStudentStatusUpdate = (status) => console.log(status);
//     // // const onStudentSuccess = () => console.log('Action is successful.');
//     // // const onStudentError = (error) => console.error(error.message);

//     // // this.studentfile = this.media.create(this.studentActiveMedia.fullPath, onStudentStatusUpdate, onStudentSuccess, onStudentError);
    
//     // //this.teacherfile.play();
//     // // this.studentfile.play();

//     // console.log('Start From Teacher');
//     // // setInterval(()=>{console.log(this.teacherfile.getCurrentAmplitude())},1000);

//     // this.teacherfile.seekTo(1000);
//     // this.teacherfile.getCurrentAmplitude().then(
//     //     (value : any) => {console.log(value)
//     //     });
//     // console.log('Start From Teacher getCurrentPosition');
//     // console.log(this.teacherfile.getCurrentPosition);
//     // console.log('Start From Teacher getDuration');
//     // console.log(this.teacherfile.getDuration);

//     // this.teacherfile.seekTo(2000);
//     // console.log(this.teacherfile.getCurrentAmplitude());

//     // this.teacherfile.seekTo(3000);
//     // console.log(this.teacherfile.getCurrentAmplitude());

//     // this.teacherfile.seekTo(4000);
//     // console.log(this.teacherfile.getCurrentAmplitude());

//     // this.teacherfile.seekTo(5000);
//     // console.log(this.teacherfile.getCurrentAmplitude());


//     // console.log('Start From Student');
//     // this.studentfile.seekTo(1000);
//     // console.log(this.studentfile.getCurrentAmplitude());

//     // this.studentfile.seekTo(2000);
//     // console.log(this.studentfile.getCurrentAmplitude());

//     // this.studentfile.seekTo(3000);
//     // console.log(this.studentfile.getCurrentAmplitude());

//     // this.studentfile.seekTo(4000);
//     // console.log(this.studentfile.getCurrentAmplitude());

//     // this.studentfile.seekTo(5000);    
//     // console.log(this.studentfile.getCurrentAmplitude());

//   }

//   recordLearn(){
//     let options: CaptureAudioOptions = { limit: 3 };
//     this.mediaCapture.captureAudio(options)
//       .then(
//         (data: MediaFile[]) => {
//           data.forEach(element => {
//             this.studentActiveMedia = element;
//           });
//         },
//         (err: CaptureError) => {
//           console.info(err.code);
//           this.studentActiveMedia = null;}
//       );
//   }

//   record(){
//     let options: CaptureAudioOptions = { limit: 3 };
//     this.mediaCapture
//     .captureAudio(options)
//       .then(
//         (data: MediaFile[]) => {
//           data.forEach(element => {
//             this.medias.push(element);
//             this.teacherActiveMedia = element;
//             this.task.recordPath = element.fullPath;
//             this.teacherActiveMedia.getFormatData(data => {
//             }, error => {
//             });
//           });
//         },
//         (err: CaptureError) => {
//           console.info(err.code);
//           this.teacherActiveMedia = null;
//           this.task.recordPath = null;}
//       );    
//   }

  

//   play(){
//     if(this.task.recordPath == null){
//       return;
//     }
//     const onStatusUpdate = (status) => console.log(status);
//     const onSuccess = () => console.log('Action is successful.');
//     const onError = (error) => console.error(error.message);

//     this.teacherfile = this.media.create(this.task.recordPath, onStatusUpdate, onSuccess, onError);

//     // play the file
//     this.teacherfile.play();
//     // pause the file
//     // file.pause();

//     // get current playback position
//     // file.getCurrentPosition().then((position) => {
//     //   console.log(position);
//     // });

//     // get file duration
//     // let duration = file.getDuration();
//     // console.log(duration);

//     // skip to 10 seconds (expects int value in ms)
//     // file.seekTo(10000);

//     // stop playing the file
//     // file.stop();

//     // release the native audio resource
//     // Platform Quirks:
//     // iOS simply create a new instance and the old one will be overwritten
//     // Android you must call release() to destroy instances of media when you are done
//     // file.release();    
//   }
  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
    this.user.load().then(() => {
      this.acitiveUser = this.user.user;
    });    
  }

  ionViewWillLeave() {
    // this.medias.forEach(element => {
    //     if(element != this.teacherActiveMedia){
    //       // this.file.removeFile(element.fullPath.replace(element.name,''), element.name).then().catch();
    //       // can't delete...
    //       this.file.checkFile(element.fullPath.replace(element.name,''), element.name).then(() =>
    //       this.file.removeFile(element.fullPath.replace(element.name,''), element.name).then().catch())
    //       .catch(err => console.error(err.json));
    //     }
    //   })

    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  } 
}