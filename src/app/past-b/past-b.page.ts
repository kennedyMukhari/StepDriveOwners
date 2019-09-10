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
  Newreviews = [];
  constructor(private router: Router) { 
  

  }

  ionViewWillEnter(){
   
    this.db.collection('reviews').onSnapshot(snapshot => {
      this.Newreviews = [];
     
      snapshot.forEach(Element => {
       
            this.reviews.push(Element.data());
      });

      this.reviews.forEach(item => {
      
        if(item.schooluid === firebase.auth().currentUser.uid){
                 this.Newreviews.push(item)
              }
      })
      
      console.log('NewreViews', this.Newreviews.length);
    });

    
    
    
  }

  ngOnInit() {
  }
  goToGraph() {
    this.router.navigate(['graphs']);
  }
}
