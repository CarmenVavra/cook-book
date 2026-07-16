import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RecipeCategories } from './recipe-categories';

describe('RecipeCategories', () => {
  let component: RecipeCategories;
  let fixture: ComponentFixture<RecipeCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCategories],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCategories);
    fixture.componentRef.setInput('typeId', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
