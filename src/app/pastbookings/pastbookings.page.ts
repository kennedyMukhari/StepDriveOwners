import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { DataSavedService } from '../data-saved.service';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-pastbookings',
  templateUrl: './pastbookings.page.html',
  styleUrls: ['./pastbookings.page.scss'],
})
export class PastbookingsPage implements OnInit {
  
  db = firebase.firestore();
  storage = firebase.firestore();
  
 Booking= [];
 NewBooking=[];
 user=[];
 Customer = [];
 SortedBookings = [];



  constructor(public data : DataSavedService, public platform : Platform) { 

 
    //retriving data from booking collection
    // this.db.collection('bookings').onSnapshot(snapshot => {

    //   snapshot.forEach(doc => {
    //     // this.users = doc.data();
    //     // this.addMarkersOnTheCustomersCurrentLocation(this.users.coords.lat, this.users.coords.lng);
    //     this.Booking.push(doc.data());
    //     console.log('My array is ',this.Booking);

     
    //   })

    //   this.Booking.forEach(Customers => {
    //     console.log('Customers in my array', Customers);
    //     console.log('My array is dddd ',this.Booking);
    //     console.log('Owners UID logged in', firebase.auth().currentUser.uid);
        
       
    //     if(Customers.book === true && Customers.schooluid == firebase.auth().currentUser.uid){
    //       console.log('one');
    //     this.NewBooking.push(Customers);
    //     console.log('Served booking', this.NewBooking);
    //     }
    //   }) 

    // });

  
    



  }

  
 ionViewDidEnter(){

  // this.platform.ready().then(() => {
  //   console.log('Core service init');
  //   const tabBar = document.getElementById('myTabBar');
  //    tabBar.style.display = 'none';
  // });

    
  // this.platform.ready().then(() => {
  //   console.log('Core service init');
  //   const tabBar = document.getElementById('myTabBar');
  //    tabBar.style.display = 'none';
  // });

  this.Booking = [];
  this.Customer = this.data.SavedData;
  console.log("Data in the profile is",this.Customer);
  console.log("Customers data in past bookings is",this.Customer );
  this.Customer.forEach(Customers => { 
    if(Customers.doc.schooluid === firebase.auth().currentUser.uid) {
      this.Booking.push(Customers)
    }        
  })
  this.SortData();
 }
 

 bubbleSort(array){
  const length = array.length;
  for(let i = 0; i < length; i++){
    for(let j = 0; j < length - 1; j++){
      if(array[j].doc.date > array[j + 1].doc.date){
        this.swap(array, j, j + 1);
      }
    }
  }

  return array;
}

swap(array, a, b){
 const temp = array[a];
 array[a] = array[b];
 array[b] = temp;
}


SortData(){
     let MyArray = this.Booking;
     this.SortedBookings = this.bubbleSort(MyArray);  
}

showTab(){
  this.platform.ready().then(() => {
    console.log('Core service init');
    const tabBar = document.getElementById('myTabBar');
    tabBar.style.display = 'flex';
  });
    
}


  ngOnInit() {
  
  }


  async getBooking(){
    let data = {
      user: {
        image: null,
      },
      request: {
        book: null,
        confirmed: null,
        location: {},
        package: {},
        datecreated: null,
        datein: null,
        dateout: null,
        schooluid: null,
        uid: null,
        docid: null
      }
    }
  
    await this.db.collection('bookings').where('schooluid', '==', firebase.auth().currentUser.uid).get().then( async res => {
      let document = res;
      await res.forEach( async doc => {
        data.request.docid = doc.id;
        // this is extreme bad programming :(
        data.request.book = doc.data().book;
        data.request.confirmed = doc.data().confirmed
        data.request.location= doc.data().location
        data.request.package = doc.data().package
        data.request.datecreated= doc.data().datecreated
        data.request.datein= doc.data().datein
        data.request.dateout= doc.data().dateout
        data.request.schooluid= doc.data().schooluid
        data.request.uid= doc.data().uid

        await this.db.collection('users').where('uid', '==', doc.data().uid).get().then(async res => {
          console.log('res', res);
          
          await res.forEach( async doc => {
            console.log('users', doc.data());
            
            data.user.image = doc.data().image;
          })
          console.log('bookings', data);
          this.Booking.push(data);
          
        })
      })
      // console.log('Reqs: ', this.Booking);
    })
  }
}
