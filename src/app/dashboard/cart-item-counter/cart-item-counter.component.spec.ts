import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemCounterComponent } from './cart-item-counter.component';

describe('CartItemComponent', () => {
  let component: CartItemCounterComponent;
  let fixture: ComponentFixture<CartItemCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartItemCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
