import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHouseModalComponent } from './add-house-modal.component';

describe('AddHouseModalComponent', () => {
  let component: AddHouseModalComponent;
  let fixture: ComponentFixture<AddHouseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHouseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHouseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
