import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
@Component({
  selector: 'app-past-b',
  templateUrl: './past-b.page.html',
  styleUrls: ['./past-b.page.scss'],
})
export class PastBPage implements OnInit {
  db = firebase.firestore();
  storage = firebase.firestore();
  // reviews = [];
  review= [];
  newreviews=[];
  constructor(private router: Router) { 
    this.db.collection('reviews').onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        // this.users = doc.data();
        // this.addMarkersOnTheCustomersCurrentLocation(this.users.coords.lat, this.users.coords.lng);
        this.review.push(doc.data());
        console.log('My array is ',this.review);
        this.review.forEach(Customers => {
          console.log('reviews in my array in my array', Customers.schooluid);
          console.log('Owners UID logged in', firebase.auth().currentUser.uid);
          if(Customers.schooluid === firebase.auth().currentUser.uid){
             this.review.push(doc.data())
          }
        }) 

      })
    });

  }

  ngOnInit() {
  }
  goToGraph() {
    this.router.navigate(['graphs']);
  }
}
