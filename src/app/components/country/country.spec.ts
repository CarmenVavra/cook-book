import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { Country } from './country';

describe('Country', () => {
  let component: Country;
  let fixture: ComponentFixture<Country>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Country],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated$: of(false) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Country);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
