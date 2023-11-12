import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyRatesFilterComponent } from './currency-rates-filter.component';

describe('CurrencyRatesFilterComponent', () => {
  let component: CurrencyRatesFilterComponent;
  let fixture: ComponentFixture<CurrencyRatesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyRatesFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyRatesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
