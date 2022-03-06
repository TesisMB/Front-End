import { EmergencyDisaster } from './../../models/emergencyDisaster';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-delete-modal',
  templateUrl: './ngbd-delete-modal.component.html',
  styleUrls: ['./ngbd-delete-modal.component.css']
})
export class NgbdDeleteModalComponent implements OnInit {

  @Input() emergencyDisaster: EmergencyDisaster;
  
  titulo: string;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
