import { Component } from '@angular/core';
import { NavController, List } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import {  Platform } from 'ionic-angular';
import {  HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  
  constructor(public navCtrl: NavController, private databaseprovider: DatabaseProvider, public toastCtrl: ToastController) {
  
  }   

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 1000
    });
    toast.present();
  }
  task:string;
  des:string;
  date:string;
  time:string;

  add(){
    if( typeof( this.task ) === "string" && this.task.length > 0){
      let data: string[] = [this.task,this.des,this.date,this.time];
      this.databaseprovider.addTask(data)
      this.presentToast("Task added!");
    }
    else{
      this.presentToast("Please enter atleast Task Title");
      
    }
      
    
  }
  back(){
    this.task=""
    this.des=""
    this.date=""
    this.time=""
  }
  
}
