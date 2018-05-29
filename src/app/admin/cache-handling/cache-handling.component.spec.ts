import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheHandlingComponent } from './cache-handling.component';

describe('CacheHandlingComponent', () => {
  let component: CacheHandlingComponent;
  let fixture: ComponentFixture<CacheHandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CacheHandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
