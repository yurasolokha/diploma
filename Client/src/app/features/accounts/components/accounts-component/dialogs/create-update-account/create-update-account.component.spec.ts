import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateAccountComponent } from './create-update-account.component';

describe('CreateUpdateAccountComponent', () => {
  let component: CreateUpdateAccountComponent;
  let fixture: ComponentFixture<CreateUpdateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
