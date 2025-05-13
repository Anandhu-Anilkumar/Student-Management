import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmGridComponent } from './sm-grid.component';

describe('SmGridComponent', () => {
  let component: SmGridComponent;
  let fixture: ComponentFixture<SmGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
