import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifiersDashboardComponent } from './classifiers-dashboard.component';

describe('ClassifiersDashboardComponent', () => {
  let component: ClassifiersDashboardComponent;
  let fixture: ComponentFixture<ClassifiersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassifiersDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifiersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
