import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { Camera,CameraOptions } from '@ionic-native/Camera/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { PopoverController } from '@ionic/angular';
import { PopOverComponent } from '../pop-over/pop-over.component';
import { AlertController } from '@ionic/angular';
import { TabsService } from '../core/tabs.service';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FormGroup, Validators,FormControl, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';






@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})




export class ProfilePage implements OnInit {
  @ViewChild('inputs', {static: true}) input:ElementRef
 
  display = false;
  toastCtrl: any;

  option={
    componentRestrictions: { country: 'ZA' }
    };

  swipeUp() {
    this.display = !this.display;
  }
  
  loginForm: FormGroup;
  
  users = {
    schoolname: '',
    registration: '',
    email: '',
    cellnumber: '',
    cost: '',
    desc: '',
    open: '',
    closed: '',
    allday: '',
  //  name:'',
  //  number: '',
  //  amount:''
  }

  options : GeolocationOptions;
  currentPos : Geoposition;
  db = firebase.firestore();
  storage = firebase.storage().ref();


  // pack = {
    amount: string = '';
    name: string = '';
    number: string = '';
  // }

   pack = {
    amount: this.amount,
    name: this.name,
    number: this.number,
  }  
  
  opened : boolean

  businessdata = {
    schoolname: '',
    registration: '',
    image: '',
    email: '',
    cellnumber: '',
    cost: '',
    desc: '',
    address: '',
    packages : [],
    open: '',
    closed: '',
    allday: 'true',
    schooluid: '',
   
  }

  counter : number = 0;
  // now = moment().format('"hh-mm-A"');

  validation_messages = {
    'schoolname': [
      {type: 'required', message: 'schoolname is required.'},
   
    ],
    'registration': [
     {type: 'required', message: 'registration is required.'},
     {type: 'minlength', message: 'registration must be atleast 6 char or more.'},
     {type: 'maxlength', message: 'registration must be less than 8 char or less'},
   ],
   'email': [
    {type: 'required', message: 'email is valid.'},
    {type: 'minlength', message: 'email is required.'},

  ],
  'cellnumber': [
    {type: 'required', message: 'cellnumber is required.'},
    {type: 'minlength', message: 'cellnumber must be atleast 10 char or more.'},
    {type: 'maxlength', message: 'cellnumber must be less than 10 char or less'},
  ],
  'cost': [
    {type: 'required', message: 'cost is required.'},
    {type: 'minlength', message: 'cost is required.'},
    {type: 'maxlength', message: 'cost is required.'},
  ],
  'address': [
    {type: 'required', message: 'address is required.'},
    {type: 'minlength', message: 'address is required.'},
    {type: 'maxlength', message: 'address is required.'},
  ],
  'open': [
    {type: 'required', message: 'open is required.'},
    {type: 'minlength', message: 'open must be atleast 6 char or more.'},
    {type: 'maxlength', message: 'open must be less than 8 char or less'},
  ],
  'closed': [
    {type: 'required', message: 'closed is required.'},
    {type: 'minlength', message: 'closed must be atleast 6 char or more.'},
    {type: 'maxlength', message: 'closed must be less than 8 char or less'},
  ],
  'allday': [
    {type: 'required', message: 'Password is required.'},
    {type: 'minlength', message: 'password must be atleast 6 char or more.'},
    {type: 'maxlength', message: 'Password must be less than 8 char or less'},
  ]
  }


  profileForm: FormGroup
  profileImage: string;
  userProv: any;
  uploadprogress: number;
  isuploading: boolean;
  userProfile: any;
  isuploaded: boolean;
  imageSelected: boolean;
  constructor(public formBuilder: FormBuilder ,
     private geolocation : Geolocation, 
     public forms: FormBuilder,
     public router:Router,
     public camera: Camera,
     public alertController: AlertController,
     public popoverController: PopoverController,
     public rendere: Renderer2, 
     public tabs: TabsService,
     public platform : Platform,
     ) 

     {
    
    this.loginForm = this.forms.group({
      // image: new FormControl(this.businessdata.image, Validators.compose([Validators.required])),
      schoolname: new FormControl(this.businessdata.schoolname, Validators.compose([Validators.required])),
    

      email: new FormControl(this.businessdata.email, Validators.compose([Validators.required])),

      cellnumber: new FormControl(this.businessdata.cellnumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),

      cost: new FormControl(this.businessdata.cost, Validators.compose([Validators.required])),

      desc: new FormControl(this.businessdata.desc, Validators.compose([Validators.required])),

      address: new FormControl(this.businessdata.address, Validators.compose([Validators.required])),

      open: new FormControl(this.businessdata.open, Validators.compose([Validators.required])),

      closed: new FormControl(this.businessdata.closed, Validators.compose([Validators.required]))

     
    })

    // this.rendere.setStyle(this.input.nativeElement, 'opacity', 'o');
    


    this.db.collection('drivingschools').where('schooluid', '==', firebase.auth().currentUser.uid).get().then(res => {
      res.forEach(doc => {
        console.log(doc.data());
        this.businessdata.image = doc.data().image
        this.businessdata.schoolname = doc.data().schoolname
        this.businessdata.registration = doc.data().registration
        this.businessdata.email = doc.data().email
        this.businessdata.cellnumber = doc.data().cellnumber
        this.businessdata.cost = doc.data().cost
        this.businessdata.desc = doc.data().desc
        this.businessdata.open = doc.data().open
        this.businessdata.address = doc.data().address
        this.businessdata.closed = doc.data().closed
        this.businessdata.packages = doc.data().packages
      })
     this.pack = this.businessdata.packages[0];
     console.log(this.businessdata);
     
    }).catch(err => {
      console.log(err);
      
    })


  }


  ionViewDidEnter(){
    
    this.getUserPosition();
    this.platform.ready().then(() => {
      console.log('Core service init');
      const tabBar = document.getElementById('myTabBar');
       tabBar.style.display = 'none';
    });

   
  }



  
  getUserPosition(){
    this.options = {
        enableHighAccuracy : true
    };
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
        this.currentPos = pos;      
        console.log(pos);
        console.log('this is your Current Location', pos.coords.latitude);
    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
}


  showData(){
    // console.log('Data in the package',this.amount);
  }

 async addPack(obj){
  
  
  
    if(obj.amount !== '' && obj.name !== '' && obj.number !== '' && this.counter < 4){
      this.businessdata.packages.push({name: obj.name, amount:obj.amount, number:obj.number});
      // obj.name = '';
      // obj.amount = '';
      // obj.number = '';
      this.counter += 1;
      console.log('Package ',obj);
      console.log('Package ', this.counter);
    }else{
      const alert = await this.alertController.create({
        // header: 'Alert',
        // subHeader: 'Subtitle',
        message: 'Fields cannot be empty!',
        buttons: ['OK']
      });
      await alert.present();
    }
   
    // if (!this.pack.amount || !this.pack.name || !this.pack.number) {
    //   const alert = await this.alertController.create({
    //     header: 'Alert',
    //     subHeader: 'Subtitle',
    //     message: 'Please fill all package fields.',
    //     buttons: ['OK']
    //   });
  
    //   await alert.present();
      
    // } else {

    //   console.log('Pack added');
      
      // if (this.businessdata.packages.length !== 4) {
       
      // this.pack = {
      // amount: '',
      // name: '',
      // number: ''
      // }
      // }
    // }
  }

  async CheckData(){
  
    
    if(this.businessdata.closed.slice(11, 16) === this.businessdata.open.slice(11, 16) || this.businessdata.closed.slice(11, 16) < this.businessdata.open.slice(11, 16)){
      const alert = await this.alertController.create({
        // header: 'Alert',
        // subHeader: 'Subtitle',
        message: 'time canot not be the same .',
        buttons: ['OK']
      });
      await alert.present();
    }else{
      const alert = await this.alertController.create({
        // header: 'Alert',
        // subHeader: 'Subtitle',
        message: 'Well Done Buddy Way to Go!',
        buttons: ['OK']
      });
      await alert.present();
    }
     
      
    }

  deletepack(index) {
    this.businessdata.packages.splice(index, 1);
  }

  editpack(pack) {
    console.log('This is your pack',pack);
    this.pack = pack;
  }
  // options : GeolocationOptions;
  ngOnInit() {
  }




  // image upload

  async selectImage(){
    let option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then( res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      this.profileImage = image;
      // const UserImage = this.storage.child(this.userProv.getUser().uid+'.jpg');
      let imageRef =this.storage.child('image').child('imageName');

    const upload = imageRef.putString(image, 'data_url');
     upload.on('state_changed', snapshot => {
       let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       this.uploadprogress = progress;
       if (progress == 100){
        this.isuploading = true;

         if (this.uploadprogress == 100) {
           this.isuploading = false;
         } else {
           this.isuploading = true;
         }


       }
     }, err => {
     }, () => {
      upload.snapshot.ref.getDownloadURL().then(downUrl => {
        this.businessdata.image = downUrl;
        console.log('Image downUrl', downUrl);

        this.isuploaded = true;
      })
     })
    }, err => {
      console.log("Something went wrong: ", err);
    })
    this.imageSelected = true;
  }
  



  // await(){
  //   this.router.navigateByUrl('/Awaiting')
  // }
  //inserting driving drivers school details to the database 


 
  async  createAccount(loginForm: FormGroup): Promise<void>{
    

    console.log('Results in the businessdata', this.businessdata.schoolname == '');
    console.log("showTabs tab method is called");

      // console.log('The data',this.businessdata.closed.slice(11, 16)  > this.businessdata.open.slice(11, 16)  );
      //   const tabBar = document.getElementById('myTabBar');
      //   tabBar.style.display = 'flex';


      // this.businessdata.closed.slice(11, 16)  != this.businessdata.open.slice(11, 16)  && this.businessdata.closed.slice(11, 16)  > this.businessdata.open.slice(11, 16)

        if (loginForm.valid ){
          console.log('Results in the businessdata', loginForm.valid);
          if( this.businessdata.closed.slice(11, 16)  != this.businessdata.open.slice(11, 16)  && this.businessdata.closed.slice(11, 16)  > this.businessdata.open.slice(11, 16)){

               if(this.businessdata.schoolname == ''){

                this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({
                  address : this.businessdata.address,
                  allday : this.businessdata.allday,
                  cellnumber : this.businessdata.cellnumber,
                  closed : this.businessdata.closed,
                  cost : this.businessdata.cost,
                  desc : this.businessdata.desc,
                  email : this.businessdata.email,
                  image : this.businessdata.image,
                  open : this.businessdata.open,
                  coords : {lat:  this.currentPos.coords.latitude,
                  lng:  this.currentPos.coords.longitude},
                  packages :this.businessdata.packages,
                  registration : this.businessdata.registration,
                  schoolname : this.businessdata.schoolname,
                  schooluid : firebase.auth().currentUser.uid           
                }).then(res => {           
                  // console.log('Profile created');
                  // this.getProfile()
                  // this.router.navigateByUrl('the-map');
                }).catch(error => {
                  console.log('Error');
                });
    
                this.platform.ready().then(() => {
                  console.log('Core service init');
                  const tabBar = document.getElementById('myTabBar');
                  tabBar.style.display = 'flex';
                });
                  
    
                const alert = await this.alertController.create({
                  // header: 'Alert',
                  // subHeader: 'Subtitle',
                  message: 'Profile successfully created!',
                  buttons: ['OK']
                });
                await alert.present();

               }else{

              

                this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({
                  address : this.businessdata.address,
                  allday : this.businessdata.allday,
                  cellnumber : this.businessdata.cellnumber,
                  closed : this.businessdata.closed,
                  cost : this.businessdata.cost,
                  desc : this.businessdata.desc,
                  email : this.businessdata.email,
                  image : this.businessdata.image,
                  open : this.businessdata.open,
                  coords : {lat:  this.currentPos.coords.latitude,
                  lng:  this.currentPos.coords.longitude},
                  packages :this.businessdata.packages,
                  registration : this.businessdata.registration,
                  schoolname : this.businessdata.schoolname,
                  schooluid : firebase.auth().currentUser.uid           
                }).then(res => {           
                  // console.log('Profile created');
                  // this.getProfile()
                  // this.router.navigateByUrl('the-map');
                }).catch(error => {
                  console.log('Error');
                });
    
               
    
                const alert = await this.alertController.create({
                  // header: 'Alert',
                  // subHeader: 'Subtitle',
                  message: 'Profile successfully updated!',
                  buttons: ['OK']
                });
                await alert.present();


                this.platform.ready().then(() => {
                  console.log('Core service init');
                  const tabBar = document.getElementById('myTabBar');
                  tabBar.style.display = 'flex';
                });
                  
               }
          

          }else{
            const alert = await this.alertController.create({
              // header: 'Alert',
              // subHeader: 'Subtitle',
              message: 'Enter the correct time!',
              buttons: ['OK']
            });     
            await alert.present();
          }   

        }else{
          const alert = await this.alertController.create({
            // header: 'Alert',
            // subHeader: 'Subtitle',
            message: 'Fields cannot be empty!',
            buttons: ['OK']
          });     
          await alert.present();
        }
      }


      // async open(){
      //     console.log('The customers CheckintDate ',this.businessdata.open);
      //     console.log('Todays date is ', this.now);
      //     if(this.businessdata.open < this.now){
      //       const alert = await this.alertController.create({
      //         message: 'Please select the correct time.',
      //         buttons: ['OK']
      //       });
      //         alert.present();
      //     }else {
      //       this.businessdata.open = true;
      //     }
      //     console.log(this.businessdata.open);
      //   }
      
      //   closed(){
      //     console.log('The customers CheckOutDate ',  this.businessdata.closed );
      //     console.log('Todays date is ', this.now);
      //     if(this.businessdata.closed <  this.businessdata.closed){
      //       const alert = await this.alertController.create({
      //         message: 'Please select the correct time.',
      //         buttons: ['OK']
      //       });
      //         alert.present();
      //     }else if( this.businessdata.closed === undefined){
      //       const alert =  this.alert.create({
      //         message: 'Please select the Checkin time first.',
      //         buttons: ['OK']
      //       });
      //         alert.present();
      //     }else if (this.businessdata.closed === this.businessdata.closed){
      //       const alert = await this.alertController.create({
      //         message: 'open and closing time cannot not the same  cannot be on the same day.',
      //         buttons: ['OK']
      //       });
      //         alert.present();
      //     }else{
      //       this.businessdata.closed = true; 
      //       console.log("the checkout part");
      //     }
      //     console.log(this.businessdata.closed);
      //   }
      


      getProfile() {
        
      
      }

      goToRev() {
        this.router.navigate(['past-b']);
      } 
      profile() {
        this.router.navigate(['the-map']);
      } 
      Logout() {
        // this.users = [];
        // this.requests = [];
        // this.NewRequeste = [];
        console.log('You are logged out');
        firebase.auth().signOut().then((res) => {
         console.log(res);
          this.router.navigateByUrl('/login');
        })
      }
      // checkAddress(){
      //   console.log(this.request.location.address);
      //   let location = this.request.location.address;
      //   let address = this.http.get('https://maps.googleapis.com/maps/api/geocode/json', {
      //     params: {
      //       address: location,
      //       key: 'AIzaSyAT55USDnQ-tZLHJlzryDJbxseD8sLSdZE'
      //     }
      //   }).subscribe(res => {
      //       console.log('Address', res.json());
      //       if (res.json().status == 'OK') {
      //         this.message.text = "Address Okay"
      //         this.message.id = 1;
      //         this.addressokay = true;
      //         this.request.location.address = res.json().results[0].formatted_address;
      //         this.request.location.lat = res.json().results[0].geometry.location.lat;
      //         this.request.location.lng = res.json().results[0].geometry.location.lng;
      //         console.log('Data: ', this.request);
    
      //       } else {
      //         this.message.text = "Address not found or Invalid."
      //         this.message.id = 0;
      //       }
      //   }, err => {
      //     console.log(err);
      //     // this.message = "Address not found or Invalid."
      //   })
      // }
    }

    