import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicSwipeAllModule } from "ionic-swipe-all";
import { FIREBASE_CONFIG } from '../environments/firebase_config';
import * as firebase from 'firebase'
import { HttpClientModule } from "@angular/common/http";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { TabsService } from './core/tabs.service';
import { FormsModule } from '@angular/forms';
// import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';




firebase.initializeApp(FIREBASE_CONFIG);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
   BrowserModule, 
  IonicModule.forRoot(),
  AppRoutingModule,
  IonicSwipeAllModule,
  HttpClientModule,
  IonicStorageModule.forRoot()],
  providers: [
    FormsModule,
    Geolocation,
    TabsService,
    StatusBar,
    SplashScreen,
    Camera,
    // PhotoViewer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeGeocoder
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
