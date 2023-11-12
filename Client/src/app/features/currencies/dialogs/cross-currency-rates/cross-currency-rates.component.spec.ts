import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossCurrencyRatesComponent } from './cross-currency-rates.component';

describe('CrossCurrencyRatesComponent', () => {
  let component: CrossCurrencyRatesComponent;
  let fixture: ComponentFixture<CrossCurrencyRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossCurrencyRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossCurrencyRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
