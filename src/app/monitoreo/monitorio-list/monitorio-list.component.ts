import { AlertService } from './../../services/_alert.service/alert.service';
import { MonitoreoService } from './../monitoreo.service';
import { MonitoreoComponent } from './../monitoreo/monitoreo.component';
import { Router } from '@angular/router';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, filter } from 'rxjs/operators';
import { pipe, Observable } from 'rxjs';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import {SorteableDirective, SortEvent} from '../../directives/sorteable.directive';
import { EmergencyDisasterService } from 'src/app/emergency-disaster/emergency-disaster.service';
import { NgbdDeleteModalComponent } from 'src/app/emergency-disaster/ngbd-delete-modal/ngbd-delete-modal.component';
import { NgbdEditDialogComponent } from 'src/app/emergency-disaster/ngbd-edit-dialog/ngbd-edit-dialog.component';
import { SelectTypesEmergencyDisasterService } from 'src/app/emergency-disaster/select-types-emergency-disaster.service';
import { NgbdModalComponent } from 'src/app/users/ngbd-modal/ngbd-modal.component';
import { saveAs } from 'file-saver';
import { Files } from 'src/app/models/monitoreos';
import { DialogPDFComponent } from '../dialog-pdf/dialog-pdf.component';

@Component({
  selector: 'monitorio-list',
  templateUrl: './monitorio-list.component.html',
  styleUrls: ['./monitorio-list.component.css']
})
export class MonitorioListComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  @Input() files: Files[] = [];
  @Input() isLoading: boolean = true;
  @Input() files$: Observable<Files[]>;
  handler: any;
  array= [];
  typesid: number;
  total$: Observable<number>;



  constructor(
    public monitoreoService: MonitoreoService,
    private alertService: AlertService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private router: Router) {

      
    }
  ngOnInit(): void {
    // this.files$ = this.monitoreoService.getAll();
     /*  this.selectTypesEmergencyDisasterService.TypesEvent.subscribe(data =>{
        this.typesid = data;
        this.emergencyDisaster = this.selectTypesEmergencyDisasterService.filterTypes(this.emergencyDisasterClone);
      }) 

      this.selectTypesEmergencyDisasterService.TypesEventBoolean.subscribe(data =>{
        this.emergencyDisaster = this.selectTypesEmergencyDisasterService.status(this.emergencyDisasterClone);
      })  */

  }

  openPDF(locationFile: string){
    window.open(locationFile);
    console.log('Click en openPDF');
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // this.selectTypesEmergencyDisasterService.sortColumn = column;
    // this.selectTypesEmergencyDisasterService.sortDirection = direction;
  }

downloadPDF(fileName: string, download: boolean){
  this.monitoreoService.getFiles(fileName)
  .subscribe(
    (data) =>{
        const file = new Blob([<any>data], {type: 'application/pdf'});
          const fileURL = window.URL.createObjectURL(file);
          download ? saveAs(file, fileName) :  window.open(fileURL, fileName);     
      this.alertService.info('PDF descargado exitosamente :)', {autoClose: true});
    },
    (error)=> {
      this.alertService.error('Ha ocurrido un error :(, intentelo mas tarde', {autoClose: true});
    }
  );
}

getCardColor(state: number){
  if(state === 3){
    return '#FADBD8';
  }
  else if(state === 2){
    return '#FCF3CF';
  }
  else{
    return '#D5F5E3';

    }
}

openDialog(i: number) {
let dialogRef =  this.dialog.open(DialogPDFComponent, {
    height: '400px',
    width: '600px',
    data: { file: this.files[i], isEdit: true },
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog close => ', result);
  });
}

openVerticallyCentered(i) {
  //FALTA CONTROLAR LA CARD VERDE QUE NO SEA ABRA

    const modalRef = this.modalService.open(NgbdModalComponent,{  size: 'xl' });
    // modalRef.componentInstance.emergencyDisaster = this.selectTypesEmergencyDisasterService.emergencyDisasterObservableValue$[i];
}

deployment(){
  this.router.navigate(['emergencias/despliegue']);
}

// openDialog(i, tipo: string){
  
  // const emergency = this.emergencyDisasterObservable[i];
  // const dialogRef = this.dialog.open(NgbdEditDialogComponent);
  // dialogRef.componentInstance.emergencyDisaster = this.selectTypesEmergencyDisasterService.emergencyDisasterObservableValue$[i];
  // dialogRef.componentInstance.tipo = tipo;


// }


deleteModal(id: number){
  this.monitoreoService.delete(id).subscribe(
    data => {
      this.monitoreoService.deletePDF(id);
      this.alertService.success('Eliminado con exito!', {autoClose:true});
  },
  (error) =>  {this.alertService.error('Error al eliminar, intente mas tarde', {autoClose : true})});
  // const emergency = this.emergencyDisasterObservable[i];
  // const dialogRef = this.modalService.open(NgbdDeleteModalComponent, { centered: true });
  // dialogRef.componentInstance.emergencyDisaster = this.selectTypesEmergencyDisasterService.emergencyDisasterObservableValue$[i];
  // dialogRef.componentInstance.titulo = reason;
}


}
