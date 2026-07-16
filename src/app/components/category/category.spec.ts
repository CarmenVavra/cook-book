import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { Category } from './category';

describe('Category', () => {
  let component: Category;
  let fixture: ComponentFixture<Category>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Category],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated$: of(false) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Category);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
