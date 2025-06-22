import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHouseModalComponent } from './edit-house-modal.component';

describe('EditHouseModalComponent', () => {
  let component: EditHouseModalComponent;
  let fixture: ComponentFixture<EditHouseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHouseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHouseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
