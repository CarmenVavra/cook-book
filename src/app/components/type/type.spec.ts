import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { Type } from './type';

describe('Type', () => {
  let component: Type;
  let fixture: ComponentFixture<Type>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Type],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated$: of(false) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Type);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
