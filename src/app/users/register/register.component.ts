import { Role, User} from 'src/app/models';
import { TableService } from 'src/app/services/_table.service/table.service';
import { UserService } from './../index';
import { AlertService} from '../../services';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ResourcesService } from 'src/app/resources/resources.service';
const PATCH_LOCATIONS = 'estates';
@Component({
selector: 'register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('stepper',{read:MatStepper}) stepper:MatStepper;

    currentUser: User = null;
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    error: any = "";
    registerHandler: any;
    genre = [{value: 'M', viewValue:'Masculino'},{value: 'F', viewValue:'Femenino'}, {value: 'O', viewValue:'Otrx'}];
    estates : any[] = [];
    locations: any[] = [];
    roles: Role[];
    minDate: Date;
    maxDate: Date;
    patch = PATCH_LOCATIONS;
    selectedFiles?: FileList;
    selectedFileNames: string= "";
    progressInfos: any[] = [];
    message: string = "";
    previews: string = "";
    imageInfos?: Observable<any>;



    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService,
        private service: ResourcesService,

    ) {
    //   if(this.user.users.roleName=='Admin'){
    //   this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario');
    //   this.canReset = true;
    // }
    // else {
    //   this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario' && 'Admin');
    //   this.canReset = false
    // }

    }

    ngOnInit() {
      this.getDateValidations();
      this.getLocations(this.patch);
      this.roles = this.userService.listarRoles;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


      this.registerForm = this.formBuilder.group({
        // users: this.formBuilder.group({
          userDni:      ['', [Validators.required,Validators.pattern("[0-9]{7,9}[a-zA-Z ]{0,2}")]],
          FK_RoleID:    ['', [Validators.required]],
          FK_EstateID:    ['', [Validators.required]],
          FK_LocationID: ['', [Validators.required]],
          avatar: [],
        persons: this.formBuilder.group({
          lastName: ['',[Validators.required, Validators.pattern("[a-zA-Z ]{2,15}")]],
          firstName:['',[Validators.required, Validators.pattern("[a-zA-Z ]{2,15}")]],
          gender: ['',[Validators.required]],
          birthdate: ['',[Validators.required]],
          phone:    ['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          email:    ['',[Validators.required,Validators.email]],
          address: ['',[Validators.required, Validators.maxLength(20)]],
          locationName: ['',[Validators.required, Validators.maxLength(20)]]
          }),
        // }),
      });


       this.formUser.get('FK_LocationID').valueChanges.subscribe(value =>{
         this.estates = this.locations.filter(x => x.locationID === value);
         return console.log('Sucursales => ', this.estates);
       } );
    }

    // Es un getter conveniente para facilitar el acceso a los campos del formulario
    get f() { return this.registerForm.controls; }
    get formUser () { return this.registerForm;}
    get formPerson () { return this.registerForm.get('persons');}
    get isVoluntario() {return this.formUser.get('FK_RoleID').value == 5;}
    private getDateValidations(){
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();

      this.minDate = new Date(currentYear - 99,currentMonth, currentDate);
      this.maxDate = new Date(currentYear - 18, currentMonth, currentDate);
     // const max = this.maxDate.;
     // console.log(max);
     // console.log(this.minDate);
    }


    onSubmit() {

        // this.formUser.get('FK_LocationID').patchValue();
        //Resetea las alertas
        this.alertService.clear();
        // STOP si el formulario es invalido.
        if (this.registerForm.invalid) {
          console.log("No registró");
            return;
        }
        this.loading = true;
        this.register();

    }


    selectFiles(event: any): void {
      this.message = "";
      this.progressInfos = [];
      this.selectedFileNames = "";
      this.selectedFiles = event.target.files;
    //  this.previews = "";
      if (this.selectedFiles && this.selectedFiles[0]) {

        const numberOfFiles = this.selectedFiles.length;
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            console.log(e.target.result);
            this.previews = e.target.result;
          };
          reader.readAsDataURL(this.selectedFiles[i]);
          this.selectedFileNames = this.selectedFiles[i].name;
        }
         this.uploadFiles();
      }
    }

    uploadFiles(): void {
      this.message = "";
      if (this.selectedFiles) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
           this.upload(i, this.selectedFiles[i]);
        }
      }
    }



    upload(idx: number, file: File): void {
      this.progressInfos[idx] = { value: 0, fileName: file.name };
      if (file) {
        this.service.upload(file)
        .subscribe(
          (event: any) => {
           if (event.type === HttpEventType.UploadProgress) {
             this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
           } else if (event instanceof HttpResponse) {
           this.registerForm.get('avatar').patchValue(event.body);
              // const msg = 'Se cargó la imagen exitosamente!: ' + file.name;
              // this.message = msg;
             this.imageInfos = this.service.getFiles();
             }
          },
          (err: any) => {
            this.progressInfos[idx].value = 0;
            const msg = 'No se ha podido cargar la imagen: ' + file.name;
            this.message = msg;
          });
      }
    }


  private register(){
    if(this.isVoluntario){
      this.registerForm.addControl('volunteers', this.formBuilder.group({
        volunteerDescription: [null],
        ImageFile: [null]}));
    }
    else if(this.registerForm.get('volunteers')){
      this.registerForm.removeControl('volunteers');
    }

      this.registerHandler = this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
          data => {
              this.alertService.success('Registro exitoso :)', { autoClose: true });
              // this.router.navigate(['/'], { relativeTo: this.route });
              //this.tableService._setEmployee();
                this.loading = false;
                this.stepper.reset();


          },
          error => {
              this.error = error;
              this.alertService.errorForRegister(error);
              this.loading = false;

          });
    }
    private getLocations(patch){
      this.userService.getLocations(patch).subscribe(
        data => {
          this.locations = data;
          console.log(data);
          console.log(this.estates);

        },
        error => {
          console.log(error);
        }
      )
    }

    // onSelectFile(event) {
    //   if (event.target.files && event.target.files[0]) {
    //     let reader = new FileReader();

    //     reader.readAsDataURL(event.target.files[0]); // Lee el archivo como DATA URL

    //     reader.onload = (event) => { // Es llamado cuando el metodo readAsDataURL es completado
    //       this.url = event.target.result;

    //     }
    //   }
    // }
    ngOnDestroy(){
      if(this.registerHandler){
      this.registerHandler.unsubscribe();
    }
    }
}
