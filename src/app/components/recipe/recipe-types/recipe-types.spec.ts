import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RecipeTypes } from './recipe-types';

describe('RecipeTypes', () => {
  let component: RecipeTypes;
  let fixture: ComponentFixture<RecipeTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeTypes],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
