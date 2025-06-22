import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApartmentByAdminComponent } from './edit-apartment-by-admin.component';

describe('EditApartmentByAdminComponent', () => {
  let component: EditApartmentByAdminComponent;
  let fixture: ComponentFixture<EditApartmentByAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditApartmentByAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditApartmentByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
