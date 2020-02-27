import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalerrorComponent } from './technicalerror.component';

describe('TechnicalerrorComponent', () => {
  let component: TechnicalerrorComponent;
  let fixture: ComponentFixture<TechnicalerrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalerrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
