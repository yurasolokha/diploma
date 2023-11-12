import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCurrencyRateComponent } from './create-update-currency-rate.component';

describe('CreateUpdateCurrencyRateComponent', () => {
  let component: CreateUpdateCurrencyRateComponent;
  let fixture: ComponentFixture<CreateUpdateCurrencyRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateCurrencyRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateCurrencyRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
