import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremadeCalcsComponent } from './premade-calcs.component';

describe('PremadeCalcsComponent', () => {
  let component: PremadeCalcsComponent;
  let fixture: ComponentFixture<PremadeCalcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremadeCalcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremadeCalcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
