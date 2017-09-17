import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray,
         FormGroup,
	 FormControl,
	 FormBuilder,
	 Validators
	 } from '@angular/forms';
import { RecipeService } from '../recipe.service'
import { Recipe } from '../recipe'
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'rb-recipe-edit',
  templateUrl: './recipe-edit.component.html',
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  recipeForm: FormGroup;     
  private subscription: Subscription;
  private recipeIndex: number;
  private recipe: Recipe;
  private isNew = false;
  constructor(private activatedRoute: ActivatedRoute,
              private recipeService: RecipeService,
	      private formBuilder: FormBuilder,
	      private router: Router) {
    
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (params: any) => {
        if(params.hasOwnProperty('id')) {
	  this.isNew = false;
	  this.recipeIndex = +params['id'];
	  this.recipe = this.recipeService.getRecipe(this.recipeIndex);
	} else {
	  this.isNew = true;
	  this.recipe = null;
	}
	this.initForm();
      }
    );    
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSubmit(){
    const newRecipe = this.recipeForm.value;
    if(!this.isNew){
      this.recipeService.editRecipe(this.recipe, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.navigateBack();
  }

  onCancel(){
    this.navigateBack();
  }

  onAddItem(name: string, amount: string){
     (<FormArray>this.recipeForm.controls['ingredients']).push(
       new FormGroup({
       	  name: new FormControl(name, Validators.required),
	  amount: new FormControl(amount, [Validators.required, Validators.pattern("\\d+")])

       })      
     );
  }

  onRemoveItem(index: number){
    (<FormArray>this.recipeForm.controls['ingredients']).removeAt(index);
  }

  private navigateBack(){
    this.router.navigate(['../']);
  }

  private initForm() {
    let recipeName = '';
    let recipeImageUrl = '';
    let recipeContent = '';
    let recipeIngredients: FormArray = new FormArray([]);

    if (!this.isNew) {
      for (let i=0; i< this.recipe.ingredients.length; i++ )
      {
        recipeIngredients.push(new FormGroup({
	  name: new FormControl(this.recipe.ingredients[i].name, Validators.required),
	  amount: new FormControl(this.recipe.ingredients[i].amount, [Validators.required, Validators.pattern("\\d+")])
	})
       );
      }
      recipeName = this.recipe.name;
      recipeImageUrl = this.recipe.imagePath;
      recipeContent = this.recipe.description;
    }
      this.recipeForm = this.formBuilder.group({
        name: [recipeName, Validators.required],
	imagePath: [recipeImageUrl, Validators.required],
	description: [recipeContent, Validators.required],
	ingredients: recipeIngredients
      
      });
  }
  
}
