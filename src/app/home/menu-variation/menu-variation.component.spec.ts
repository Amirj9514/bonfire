import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuVariationComponent } from './menu-variation.component';

describe('MenuVariationComponent', () => {
  let component: MenuVariationComponent;
  let fixture: ComponentFixture<MenuVariationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuVariationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
