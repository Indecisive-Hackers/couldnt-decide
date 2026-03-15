import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Stance } from '../../entities/debate/debate.model';
import {DebateArenaComponent} from "../arena/debate-arena.component";

@Component({
  selector: 'app-debate-setup',
  standalone: true,
  imports: [FormsModule, DebateArenaComponent],
  templateUrl: './debate-setup.component.html',
  styleUrl: './debate-setup.component.scss'
})
export class DebateSetupComponent {
  topic = '';
  rounds = 1;
  setup = false;

  constructor(private router: Router) {}

  start(): void {
    this.setup = true;
  }
}
