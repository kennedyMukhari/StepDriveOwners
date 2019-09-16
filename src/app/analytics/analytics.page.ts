
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {


  @ViewChild('barChart', {static: false}) barChart;
//database 

db = firebase.firestore();
user = {
  uid: ''
}

Data = [];
NewData = [];

mon = []
tue = []
wed = []
thu = []
fri = []
sat = []
sun = []
//array from database
// charts =[];
NewDrivingschool=[];
Drivingschool=[];

charts: any;
  colorArray: any;
  constructor(private router: Router, private platform: Platform) {

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
   }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(res => {
      this.user.uid = res.uid;
    })
    this.getRequests();
  }

  ionViewWillEnter() {

    this.platform.ready().then(() => {
      console.log('Core service init');
      const tabBar = document.getElementById('myTabBar');
       tabBar.style.display = 'none';
    });

    this.db.collection('drivingschools').onSnapshot(snapshot => {
      this.Data = [];
      this.NewData = [];
     
      snapshot.forEach(Element => {
       
            this.Data.push(Element.data());
      });
      this.Data.forEach(item => {
      
        if(item.schooluid === firebase.auth().currentUser.uid){
                 this.NewData.push(item);
                 console.log('NewDrivingschool', this.NewData);
                 
              }
      })
      
     
    
    }); 


  this.getRequests();
  }

  


  getRequests() {

    this.db.collection('bookings').where('schooluid', '==',firebase.auth().currentUser.uid).get().then(res => {
      console.log(res);
      
      res.forEach(doc => {
       
        let date = doc.data().datecreated
        let newDate = date.split(" ")
       
        
        if (newDate[0] == "Mon") {
          this.mon.push(doc.data())
        } else if (newDate[0] == "Tue") {
          this.tue.push(doc.data())
        }else if (newDate[0] == "Wed") {
          this.wed.push(doc.data())
        }
        else if (newDate[0] == "Thu") {
          this.thu.push(doc.data())
          console.log("The new Date is",this.thu.length);
        }
        else if (newDate[0] == "Fri") {
          this.fri.push(doc.data())
        }
        else if (newDate[0] == "Sat") {
          this.sat.push(doc.data())
        }
        else if (newDate[0] == "Sun") {
          this.sun.push(doc.data())
        }
      })
      this.createBarChart();
      console.log(this.mon);
      
    }).catch(err => {
      console.log(err);
      
    })

  }

  createBarChart() {

    this.charts = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        datasets: [{
          label: 'Lessons offered per week',
          // data: [this.mon.length, this.tue.length, this.wed.length, this.thu.length, this.fri.length, this.sat.length, this.sun.length],
           data: [this.mon.length, this.tue.length, this.wed.length, this.thu.length, this.fri.length, this.sat.length, this.sun.length],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },

      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
}


showTab(){
  this.platform.ready().then(() => {
    console.log('Core service init');
    const tabBar = document.getElementById('myTabBar');
    tabBar.style.display = 'flex';
  });   
}


  goToPastB() {
    this.router.navigate(['past-b']);
  }
  
}
