import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
   Task = [];
   des = [];
   ionViewWillEnter() {
      this.loadData();
    }


    constructor(public navCtrl: NavController, private databaseprovider: DatabaseProvider, public toastCtrl: ToastController) {
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadData();
      } 
    })
  }
  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 1000
    });
    toast.present();
  }
  loadData() {
    this.databaseprovider.getTasks().then(data => {
      this.Task = data;
    })
  } 
  delete(task, date, time){
    this.databaseprovider.delTask([task, date, time]);
    this.presentToast("Task deleted!");
    this.navCtrl.setRoot(this.navCtrl.getActive().component);

  }
  info(des){
    alert("Description: " + des);

  }

}
