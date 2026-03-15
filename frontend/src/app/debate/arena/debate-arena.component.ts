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

  chats : string[] = [];
  chats_index_arr : number[] = [];
  turn = 0;
  facts : IModeration[] = [];
  facts_index_arr : number[] = [];
  score0 = 0;
  score1 = 0;

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

  protected submitAnswer() {
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
