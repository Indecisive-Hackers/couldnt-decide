import { Component, NgZone, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debate-arena',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './debate-arena.component.html',
  styleUrl: './debate-arena.component.scss'
})
export class DebateArenaComponent implements OnDestroy {
  userInput = '';
  isListening = false;

  private recognition: SpeechRecognition | null = null;

  constructor(private zone: NgZone) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      this.zone.run(() => { this.userInput = transcript; });
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.zone.run(() => {
        console.error('SpeechRecognition error:', event.error, event.message);
        this.isListening = false;
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => { this.isListening = false; });
    };
  }

  toggleDictation(): void {
    if (!this.recognition) {
      console.warn('SpeechRecognition not available.');
      return;
    }
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.userInput = '';
      this.recognition.start();
      this.isListening = true;
    }
  }

  ngOnDestroy(): void {
    this.recognition?.stop();
  }
}
