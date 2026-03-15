import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnsUpModalComponent } from './turns-up-modal.component';

describe('TurnsUpModalComponent', () => {
  let component: TurnsUpModalComponent;
  let fixture: ComponentFixture<TurnsUpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnsUpModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnsUpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
