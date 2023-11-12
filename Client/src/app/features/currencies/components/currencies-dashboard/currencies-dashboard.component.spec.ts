import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrenciesDashboardComponent } from './currencies-dashboard.component';

describe('CurrenciesDashboardComponent', () => {
  let component: CurrenciesDashboardComponent;
  let fixture: ComponentFixture<CurrenciesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrenciesDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrenciesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
