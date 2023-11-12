import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCreateUpdateComponent } from './transaction-create-update.component';

describe('TransactionCreateUpdateComponent', () => {
  let component: TransactionCreateUpdateComponent;
  let fixture: ComponentFixture<TransactionCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionCreateUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
