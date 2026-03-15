import { Component, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debate-arena',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './debate-arena.component.html',
  styleUrl: './debate-arena.component.scss'
})
export class DebateArenaComponent implements OnDestroy {
  userInput = signal('');
  isListening = signal(false);

  private recognition = this.initRecognition();

  private initRecognition(): SpeechRecognition | null {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return null;
    }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = (e) => this.userInput.set(
      Array.from(e.results).map(r => r[0].transcript).join('')
    );
    r.onerror = (e) => { console.error('SpeechRecognition error:', e.error); this.isListening.set(false); };
    r.onend = () => this.isListening.set(false);
    return r;
  }

  toggleDictation(): void {
    if (!this.recognition) return;
    if (this.isListening()) {
      this.recognition.stop();
    } else {
      this.userInput.set('');
      this.recognition.start();
      this.isListening.set(true);
    }
  }

  ngOnDestroy(): void { this.recognition?.stop(); }
}
