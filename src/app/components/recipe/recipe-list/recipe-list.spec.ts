import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RecipeList } from './recipe-list';

describe('RecipeList', () => {
  let component: RecipeList;
  let fixture: ComponentFixture<RecipeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeList],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeList);
    fixture.componentRef.setInput('typeId', '1');
    fixture.componentRef.setInput('categoryId', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
