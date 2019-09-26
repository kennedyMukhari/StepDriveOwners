import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';

import { TabsService } from './core/tabs.service';

import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

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
    public router: Router
    
  ) 
  
  
  {



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
          this.router.navigateByUrl('/main');
          
          console.log('Current user in', user.uid);
        } else {
          // No user is signed in.
       
          
          this.router.navigateByUrl('/');
        }
      });
      this.splashScreen.hide();
    });
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log(route);

    let authInfo = {
        authenticated: false
    };

    if (!authInfo.authenticated) {
        this.router.navigate(['login']);
        return false;
    }

    return true;

}

}
