import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApartmentByAdminComponent } from './add-apartment-by-admin.component';

describe('AddApartmentByAdminComponent', () => {
  let component: AddApartmentByAdminComponent;
  let fixture: ComponentFixture<AddApartmentByAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddApartmentByAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApartmentByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
