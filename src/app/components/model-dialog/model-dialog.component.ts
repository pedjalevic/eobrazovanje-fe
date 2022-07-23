import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-model-dialog',
  templateUrl: './model-dialog.component.html',
  // styleUrls: ['./model-dialog.component.css']
})
export class ModelDialogComponent {

  constructor(public activeModal: NgbActiveModal) { }

}
