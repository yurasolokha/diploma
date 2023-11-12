import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCurrencyComponent } from './create-update-currency.component';

describe('CreateUpdateCurrencyComponent', () => {
  let component: CreateUpdateCurrencyComponent;
  let fixture: ComponentFixture<CreateUpdateCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
