import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
// import { IonicImageViewerModule } from 'ionic-img-viewer';
import { TheMapPage } from './the-map.page';
// import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
const routes: Routes = [
  {
    path: '',
    component: TheMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // PhotoViewer,
    // IonicImageViewerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TheMapPage]
})
export class TheMapPageModule {}
