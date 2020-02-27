import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodopageComponent } from './todopage.component';

describe('TodopageComponent', () => {
  let component: TodopageComponent;
  let fixture: ComponentFixture<TodopageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodopageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodopageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
