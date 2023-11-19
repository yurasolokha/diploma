import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessesControlComponent } from './user-accesses-control.component';

describe('UserAccessesControlComponent', () => {
  let component: UserAccessesControlComponent;
  let fixture: ComponentFixture<UserAccessesControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccessesControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
