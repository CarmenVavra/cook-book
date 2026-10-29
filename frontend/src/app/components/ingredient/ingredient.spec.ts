import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { Ingredient } from './ingredient';

describe('Ingredient', () => {
  let component: Ingredient;
  let fixture: ComponentFixture<Ingredient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ingredient],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated$: of(false) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Ingredient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
