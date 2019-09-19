import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { TabsService } from './core/tabs.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  db = firebase.firestore()
  constructor(
    private platform: Platform,
    public tabs: TabsService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    private keyboard: Keyboard
  ) {



    this.initializeApp();
    // let status bar overlay webview
    // this.statusBar.overlaysWebView(true);
    statusBar.styleBlackOpaque();
    this.statusBar.styleLightContent();
    // set status bar to white
    this.statusBar.backgroundColorByHexString('#2E020C');
  }



  initializeApp() {

    this.platform.ready().then(() => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.

          console.log('Current user in', user.uid);
        } else {
          // No user is signed in.
        }
      });
      this.splashScreen.hide();
      this.keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });
      this.keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });
    });
  }
}
