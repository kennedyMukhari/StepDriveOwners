
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';

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


mon = []
tue = []
wed = []
thu = []
fri = []
sat = []
sun = []
//array from database
// charts =[];

charts: any;
  colorArray: any;
  constructor(private router: Router) {

    
   }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(res => {
      this.user.uid = res.uid;
    })
    this.getRequests();
  }

  ionViewWillEnter() {
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


  goToPastB() {
    this.router.navigate(['past-b']);
  }
  
}
