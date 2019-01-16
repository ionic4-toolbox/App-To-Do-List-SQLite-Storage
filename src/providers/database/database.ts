import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
 
@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
 
  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'task.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }
 
  fillDatabase() {
    this.http.get('assets/db.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.log(e));
      });
  }
 
  addTask(data) {
    
    return this.database.executeSql("INSERT INTO TODO (task, des, dat, time) VALUES (?, ?, ?, ?)", data)
    .then(data => {
      return data;
    }, err => {
      console.log(err);
      return err;
    });
  }
  delTask(data) {
    
    return this.database.executeSql("delete from TODO where task = ? and dat = ? and time = ?", data)
    .then(data => {
      return data;
    }, err => {
      console.log(err);
      return err;
    });
  }

  getTasks() {
    return this.database.executeSql("SELECT * FROM TODO", []).then((data) => {
      let tasks = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tasks.push({ task: data.rows.item(i).task, des: data.rows.item(i).des, date: data.rows.item(i).dat, time: data.rows.item(i).time });
          }
      }
      return tasks;
    }, err => {
      console.log(err);
      return [];
    });
  }
 
  getDatabaseState() {
    return this.databaseReady.asObservable();
  }
}