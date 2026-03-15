import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-turns-up-modal',
  standalone: true,
  imports: [],
  templateUrl: './turns-up-modal.component.html',
  styleUrl: './turns-up-modal.component.scss'
})
export class TurnsUpModalComponent {

  constructor(public activeModal : NgbActiveModal) {
  }

  finished() {
    this.activeModal.close();
  }

}
