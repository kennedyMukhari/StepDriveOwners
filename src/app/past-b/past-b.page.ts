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
  //array in a database for drivng school
  Drivingschool=[];
  NewDrivingschool=[];
  //for reviews
  reviews = [];
  Newreviews = [];
  avgRating = 0;
  ratingTotal = 0;



  constructor(private router: Router) { 
    this.db.collection('drivingschools').onSnapshot(snapshot => {
      this.NewDrivingschool = [];
     
      snapshot.forEach(Element => {
       
            this.Drivingschool.push(Element.data());
      });

      this.Drivingschool.forEach(item => {
      
        if(item.schooluid === firebase.auth().currentUser.uid){
                 this.NewDrivingschool.push(item);
             
                 
              }
      })
      
      console.log('NewDrivingschool', this.NewDrivingschool);
    
    });   
      //  this.avgRating=this.ratingTotal / this.reviews.length;
       
  }

  ionViewWillEnter(){
    firebase.auth().onAuthStateChanged(user => {
      this.db.collection('reviews').where('schooluid','==', user.uid).onSnapshot(snapshot => {
        snapshot.forEach(doc =>{
          console.log('Document : ', doc.data().image);
          
          this.ratingTotal += parseInt(doc.data().rating);
         this.reviews.push(doc.data());
         
        })
        this.avgRating = this.ratingTotal / this.reviews.length;
        console.log('revLeng', this.avgRating);
        console.log('reViews', this.reviews);
      })
    })
    

   
  }
  
    // this.db.collection('reviews').where('schooluid', '==', firebase.auth().currentUser.uid).get().then(res =>{
    //   res.forEach(doc =>{
    //     this.ratingTotal += doc.data().rating
    //     this.reviews.push(doc.data())
    //   })
    //   this.avgRating=this.ratingTotal/this.reviews.length
    // })
    // console.log('rating', this.avgRating);
 



  
  ngOnInit() {

  }
  goToGraph() {
    this.router.navigate(['graphs']);
  }
}
