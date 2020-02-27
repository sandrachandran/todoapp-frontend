import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendeditComponent } from './friendedit.component';

describe('FriendeditComponent', () => {
  let component: FriendeditComponent;
  let fixture: ComponentFixture<FriendeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
