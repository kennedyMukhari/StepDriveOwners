import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera,CameraOptions } from '@ionic-native/Camera/ngx';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { PopoverController } from '@ionic/angular';
import { PopOverComponent } from '../pop-over/pop-over.component';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})


export class ProfilePage implements OnInit {
  @ViewChild('inputs', {static: true}) input:ElementRef

  display = false;
  toastCtrl: any;
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
   name:'',
   number: '',
   amount:''
  }

  options : GeolocationOptions;
  currentPos : Geoposition;
  db = firebase.firestore();
  storage = firebase.storage().ref();


  pack = {
    amount: null,
    name: null,
    number: null
  }


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
    open: 'boolean',
    closed: 'true',
    allday: 'true',
    schooluid: '',
   
  }

  amount : string;
  now = moment().format('"hh-mm-A"');

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
  ],
  'name': [
    {type: 'required', message: 'Name is required.'},
   
  ],
  'number': [
    {type: 'required', message: 'Number of lesson required.'},
    {type: 'minlength', message: 'password must be atleast 6 char or more.'},
    {type: 'maxlength', message: 'Password must be less than 8 char or less'},
  ],
  'amount': [
    {type: 'required', message: 'Amount is required.'},
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
     public rendere: Renderer2) 

     {
    
    this.loginForm = this.forms.group({
      // image: new FormControl(this.businessdata.image, Validators.compose([Validators.required])),
      schoolname: new FormControl(this.businessdata.schoolname, Validators.compose([Validators.required])),
      
      registration: new FormControl(this.businessdata.cellnumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),
      email: new FormControl(this.businessdata.registration, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      cellnumber: new FormControl(this.businessdata.cellnumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),
      cost: new FormControl(this.businessdata.cost, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      desc: new FormControl(this.businessdata.desc, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      address: new FormControl(this.businessdata.address, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      open: new FormControl(this.businessdata.open, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      closed: new FormControl(this.businessdata.closed, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      allday: new FormControl(this.businessdata.allday, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      amount: new FormControl(this.pack.amount, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      name: new FormControl(this.pack.name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')]) ),
      number: new FormControl(this.pack.amount, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')]))
    })

    // this.rendere.setStyle(this.input.nativeElement, 'opacity', 'o');
    
    

  }

  showData(){
    console.log('Data in the package',this.amount);
  }

 async  addPack(){
    
    if (this.businessdata.packages.length == 4 || this.pack.amount === null || this.pack.name === null || this.pack.number === null) {
      const alert = await this.alertController.create({
        header: 'Alert',
        subHeader: 'Subtitle',
        message: 'filed cannot be empty and the packages must be four.',
        buttons: ['OK']
      });
  
      await alert.present();
      
    } else {
      this.businessdata.packages.push(this.pack);
      this.pack = {
      amount: null,
      name: null,
      number: null
      }
    }
  }


  deletepack(index) {
    this.businessdata.packages.splice(index, 1);
  }
  editpack(pack) {
    this.pack = pack;
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopOverComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  obj = {};
  // options : GeolocationOptions;
  ngOnInit() {
    this.options = {
      enableHighAccuracy : true
  };
  this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

      this.currentPos = pos;      
      console.log(pos);
      // this.addMap(pos.coords.latitude, pos.coords.longitude);
     
    this.obj = pos.coords;
    console.log('Current Location in the profile page', this.obj);
      // let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      // let mapOptions = {
      // center: latLng,
      // zoom: 15,
      // disableDefaultUI: true,
      // mapTypeId: google.maps.MapTypeId.ROADMAP
      // }
      // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      // this.addMarker();
      this.getProfile();
  },(err : PositionError)=>{
      console.log("error : " + err.message);
  });
    
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
        this.isuploading = false;
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


 
  async  createAccount(){
        if (this.businessdata.open != this.businessdata.closed){
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
            packages :this.businessdata.packages,
            
            registration : this.businessdata.registration,
            schoolname : this.businessdata.schoolname,
            schooluid : firebase.auth().currentUser.uid
          }).then(res => {
            console.log('Profile created');
            this.getProfile()
            this.router.navigateByUrl('main');
          }).catch(error => {
            console.log('Error');
          });

  //allrt for time 
        }else{

          const alert = await this.alertController.create({
            // header: 'Alert',
            // subHeader: 'Subtitle',
            message: 'time canot not be the same .',
            buttons: ['OK']
          });
      
          await alert.present();
          
          
        }
        
        console.log('The data',this.pack);
        

        // open(){
        //   console.log('The customers CheckintDate ',this.businessdata.open);
        //   console.log('Todays date is ', this.now);
        //   if(this.businessdata.open < this.now){
        //     const alert = await this.alertController.create({
        //       message: 'Please select the correct time.',
        //       buttons: ['OK']
        //     });
        //       alert.present();
        //   }else {
        //     this.businessdata.open = true;
        //   }
        //   console.log(this.businessdata.open);
        // }
      
        // closed(){
        //   console.log('The customers CheckOutDate ',  this.businessdata.closed );
        //   console.log('Todays date is ', this.now);
        //   if(this.businessdata.closed <  this.businessdata.closed){
        //     const alert = await this.alertController.create({
        //       message: 'Please select the correct time.',
        //       buttons: ['OK']
        //     });
        //       alert.present();
        //   }else if( this.businessdata.closed === undefined){
        //     const alert =  this.alert.create({
        //       message: 'Please select the Checkin time first.',
        //       buttons: ['OK']
        //     });
        //       alert.present();
        //   }else if (this.businessdata.closed === this.businessdata.closed){
        //     const alert = await this.alertController.create({
        //       message: 'open and closing time cannot not the same  cannot be on the same day.',
        //       buttons: ['OK']
        //     });
        //       alert.present();
        //   }else{
        //     this.businessdata.closed = true; 
        //     console.log("the checkout part");
        //   }
        //   console.log(this.businessdata.closed);
        // }
      
  




      }


      getProfile() {
        
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

      goToRev() {
        this.router.navigate(['past-b']);
      } 
    }

    