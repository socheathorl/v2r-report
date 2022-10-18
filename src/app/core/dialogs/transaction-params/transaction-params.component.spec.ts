import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionParamsComponent } from './transaction-params.component';

describe('TransactionParamsComponent', () => {
  let component: TransactionParamsComponent;
  let fixture: ComponentFixture<TransactionParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionParamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
