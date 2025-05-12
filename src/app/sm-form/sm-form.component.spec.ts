import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmFormComponent } from './sm-form.component';

describe('SmFormComponent', () => {
  let component: SmFormComponent;
  let fixture: ComponentFixture<SmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
