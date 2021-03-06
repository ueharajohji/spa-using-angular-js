import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipe';
import { Ingredient } from '../shared/ingredient';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class RecipeService {
  recipesChanged = new EventEmitter<Recipe[]>();
  private recipes: Recipe[] = [
new Recipe('スパゲティー','濃厚な味が楽しめる！','http://cdn2.tmbi.com/TOH/Images/Photos/37/300x300/exps36749_SD143203D10__25_1b.jpg',[ new Ingredient('Tomato',1),
        new Ingredient('Pasta',1)]),
new Recipe('ハムエンチーズーサンドイッチ','ボーリューミのサンドイッチを家族と楽しめる。','http://www.taste.com.au/images/recipes/sfi/2006/10/pantoasted-ham-and-cheese-sandwich-10138_l.jpeg',[])
];

  constructor(private http: Http) { }

  getRecipes(){
    return this.recipes;
  }

  getRecipe(id: number){
    return this.recipes[id];
  }

  deleteRecipe(recipe: Recipe){
    this.recipes.splice(this.recipes.indexOf(recipe),1);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
  }

  editRecipe(oldRecipe: Recipe, newRecipe: Recipe){
    this.recipes[this.recipes.indexOf(oldRecipe)] = newRecipe;
  }

  storeData(){
    const body = JSON.stringify(this.recipes[0]);
    var recipe = {
      recipe: this.recipes[0]
    }
    console.log(recipe);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post('http://localhost:3002/recipes', recipe, {headers: headers});
  }

  fetchData(){
    return this.http.get('http://localhost:3002/recipes').map(
      (response: Response) => response.json()
    ).subscribe(
      (data: Recipe[]) => {
        this.recipes = data;
	this.recipesChanged.emit(this.recipes);
      }
    );
  }

}
