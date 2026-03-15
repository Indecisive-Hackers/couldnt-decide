import {
  Component,
  signal,
  OnDestroy,
  inject,
  input,
  ViewChild,
  Output,
  EventEmitter, OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {FactCheckingApiService} from "../../entities/fact-checking/fact-checking-api.service";
import {finalize, Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {IModeration} from "../../entities/fact-checking/fact-checking-result.model";
import {TurnsUpModalComponent} from "../../turns-up-modal/turns-up-modal.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-debate-arena',
  standalone: true,
  imports: [FormsModule, TurnsUpModalComponent],
  templateUrl: './debate-arena.component.html',
  styleUrl: './debate-arena.component.scss'
})
export class DebateArenaComponent implements OnDestroy {
  userInput = signal('');
  isListening = signal(false);
  topic = input<string>("");
  max_rounds = input<number>(1);

  @Output() exit = new EventEmitter<boolean>(false);

  chats : string[] = [
    'Studies consistently show that social media increases anxiety and depression in teenagers, with usage correlated to lower self-esteem.',
    'While correlation exists, causation is unproven. Teenagers with pre-existing anxiety may simply gravitate toward social media more.',
    'The sheer volume of misinformation spread daily on these platforms is undeniable and has real-world consequences.',
    'Traditional media spreads misinformation too. Social media also enables rapid fact-checking and correction by the public.',
  ];
  chats_index_arr : number[] = [0, 1, 2, 3];
  turn = 0;
  facts : IModeration[] = [
    { facts: 'true', info: 'Multiple peer-reviewed studies confirm correlation between heavy social media use and increased anxiety in adolescents.', speaker: 0 },
    { facts: 'partial', info: 'The causal relationship is debated — some studies suggest bidirectional effects rather than one-way causation.', speaker: 1 },
    { facts: 'true', info: 'Research by MIT and Stanford documents high misinformation spread rates, particularly on Twitter and Facebook.', speaker: 0 },
  ];
  facts_index_arr : number[] = [0, 1, 2];
  score0 = 2;
  score1 = 1;

  fact_checking = inject(FactCheckingApiService);

  private recognition = this.initRecognition();

  constructor(public modalService: NgbModal) {
  }

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

  private static readonly INJECTION_PATTERNS = [
    /ignore\s+(previous|all|above)\s+(instructions?|prompts?)/i,
    /disregard\s+(previous|all|above)/i,
    /forget\s+everything/i,
    /you\s+are\s+now/i,
    /act\s+as\s+/i,
    /pretend\s+(to\s+be|you\s+are)/i,
    /system\s+prompt/i,
    /jailbreak/i,
  ];

  private static readonly MAX_LENGTH = 500;

  inputError = signal<string | null>(null);

  private validateInput(text: string): string | null {
    const trimmed = text.trim();
    if (!trimmed) return 'Argument cannot be empty.';
    if (trimmed.length > DebateArenaComponent.MAX_LENGTH)
      return `Argument must be ${DebateArenaComponent.MAX_LENGTH} characters or fewer.`;
    if (this.chats.length > 0 && trimmed === this.chats[this.chats.length - 1].trim())
      return 'Argument cannot be identical to your last submission.';
    if (DebateArenaComponent.INJECTION_PATTERNS.some(p => p.test(trimmed)))
      return 'Argument contains disallowed content.';
    return null;
  }

  protected submitAnswer() {
    const error = this.validateInput(this.userInput());
    if (error) { this.inputError.set(error); return; }
    this.inputError.set(null);
    this.chats.push(this.userInput());
    this.chats_index_arr = Array.from({ length: this.chats.length }, (_, i) => i);
    this.subscribeToSaveResponse(this.fact_checking.checkFacts(this.userInput(), this.turn));
    this.userInput.set("");
    this.turn = (this.turn + 1) % 2;
    if (Math.floor(this.chats.length/2) + 1 > this.max_rounds()) {
      const modalRef = this.modalService.open(TurnsUpModalComponent);
      modalRef.result.then(() => {
        this.exit.emit(true);
      }, (error) => {
        this.exit.emit(true);
      });
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<any>>) : void {
    result.pipe(
    finalize(() => {})).subscribe({
      next: res => {
        let fact = res.body;
        fact["facts"] = fact["facts"].toLowerCase();
        this.facts.push(fact);
        this.facts_index_arr = Array.from({ length: this.facts.length }, (_, i) => i);
        if (res.body["facts"].toLowerCase() == "true") {
          if (this.turn % 2 == 0) {
            this.score1 += 1;
          } else {
            this.score0 += 1;
          }
        }
      },
      error: err => {
        alert("Error");
      },
    })
  }

  protected readonly Array = Array;
  protected readonly Math = Math;
}
