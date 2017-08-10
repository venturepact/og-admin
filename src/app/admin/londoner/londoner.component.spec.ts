import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LondonerComponent } from './londoner.component';

describe('LondonerComponent', () => {
  let component: LondonerComponent;
  let fixture: ComponentFixture<LondonerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LondonerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LondonerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
