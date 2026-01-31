import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneDialogComponent } from './clone-dialog.component';

describe('CloneDialogComponent', () => {
  let component: CloneDialogComponent;
  let fixture: ComponentFixture<CloneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloneDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
