import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdEditDialogComponent } from 'src/app/emergency-disaster/ngbd-edit-dialog/ngbd-edit-dialog.component';


interface ResourcesRequestReports {
  id: number;
  city: string;
  type: string;
  state: string;
  degree: string;
  startDate: string;
  endDate: string;
  icon: string;
}

interface ReportData{
  name: string;
  value: number;
}
enum States {
  TODOS = 'Todas',
  ACEPTADAS = 'Aceptada',
  RECHAZADAS = 'Rechazada',
  PENDIENTES = 'Rechazada'
}

@Component({
  selector: 'resources-request-view',
  templateUrl: './resources-request-view.component.html',
  styleUrls: ['./resources-request-view.component.css']
})
export class ResourcesRequestViewComponent implements OnInit {
  @Input() data: ResourcesRequestReports[] = null;

  constructor(
    public dialogRef: MatDialogRef<NgbdEditDialogComponent>,
    private modalService: NgbModal,

    ) { 

    }

  ngOnInit(): void {
  }

}
