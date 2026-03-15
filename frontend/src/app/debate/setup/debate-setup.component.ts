import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Stance } from '../../entities/debate/debate.model';

@Component({
  selector: 'app-debate-setup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './debate-setup.component.html',
  styleUrl: './debate-setup.component.scss'
})
export class DebateSetupComponent {
  topic = '';
  stance: Stance = 'for';

  constructor(private router: Router) {}

  start(): void {
    if (!this.topic.trim()) return;
    // TODO: initialise DebateService with topic + stance before navigating
    this.router.navigate(['/arena']);
  }
}
