import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { MyRecipes } from './my-recipes';

describe('MyRecipes', () => {
  let component: MyRecipes;
  let fixture: ComponentFixture<MyRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecipes],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated$: of(false), user$: of(null) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyRecipes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
