import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
@Component({
  selector: 'app-past-b',
  templateUrl: './past-b.page.html',
  styleUrls: ['./past-b.page.scss'],
})
export class PastBPage implements OnInit {
  //database
  db = firebase.firestore();
  //array in a database
  reviews = [];
  constructor(private router: Router) { 
    this.db.collection('review').onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        // this.users = doc.data();
        // this.addMarkersOnTheCustomersCurrentLocation(this.users.coords.lat, this.users.coords.lng);
        this.reviews.push(doc.data());
        console.log('My array is ',this.reviews);
        this.reviews.forEach(Customers => {
          console.log('reviews in my array in my array', Customers.schooluid);
          console.log('Owners UID logged in', firebase.auth().currentUser.uid);
          if(Customers.schooluid === firebase.auth().currentUser.uid){
             this.reviews.push(doc.data())
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
