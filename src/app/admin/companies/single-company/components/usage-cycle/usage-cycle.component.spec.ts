import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageCycleComponent } from './usage-cycle.component';

describe('UsageCycleComponent', () => {
  let component: UsageCycleComponent;
  let fixture: ComponentFixture<UsageCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
