import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
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

  public unsubscribeBackEvent: any;

  db = firebase.firestore()
  constructor(
    private platform: Platform,
    public tabs: TabsService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    public alertCtrl: AlertController

    
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
        this.backButton()
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
  async backButton() {
    this.platform.backButton.subscribeWithPriority(1, async () => {
      console.log(this.router.url);
      if (this.router.url == '/past-b') {
      this.router.navigate(['main/profile']);
      } else {
        let alerter = await this.alertCtrl.create({
          message: 'Do you want to exit the App?',
          buttons: [{
            text: 'No',
            role: 'cancel'
          },
        {
          text: 'Yes',
          handler: ()=> {
              navigator['app'].exitApp();
          }
        }]
        })
        alerter.present()
      }
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
ngOnInit() {
  
   this.initializeBackButtonCustomHandler();
  
 }
 ionViewWillLeave() {
  // Unregister the custom back button action for this page
  this.unsubscribeBackEvent && this.unsubscribeBackEvent();
}
initializeBackButtonCustomHandler(): void {
    







// this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(999999,  () => {
//     // alert("back pressed home" + this.constructor.name);
   
// });
/* here priority 101 will be greater then 100 
if we have registerBackButtonAction in app.component.ts */
}
}
