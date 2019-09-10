import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { Router }  from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  db = firebase.firestore()
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router : Router
  ) {
    this.initializeApp();
    
  }

  initializeApp() {
    
    this.platform.ready().then(() => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          
          console.log('Current user in', user.uid);
        } else {
          // No user is signed in.
        }
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
