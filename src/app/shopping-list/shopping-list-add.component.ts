import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient'
import { ShoppingListService } from './shopping-list.service'

@Component({
  selector: 'rb-shopping-list-add',
  templateUrl: './shopping-list-add.component.html'
})
export class ShoppingListAddComponent implements OnChanges {
  isAdd = true;
  @Input() item: Ingredient;
  @Output() cleared = new EventEmitter();
  constructor(private sls: ShoppingListService) { }

  ngOnChanges(changes){
    if (changes.item.currentValue === null)
    {
      this.item = { name: null, amount: null };
      this.isAdd = true;
    }
    else
    {
      this.isAdd = false;
    }
  }

  onSubmit(ingredient: Ingredient){
    const newIngredient = new Ingredient(ingredient.name, ingredient.amount)
    if(!this.isAdd)    
    {
      this.sls.editItem(this.item, newIngredient);
      this.onClear();
    }
    else
    {
      this.item = newIngredient;
      this.sls.pushItem(this.item);
    }
  }

  onDelete(){
    this.sls.deleteItem(this.item);
    this.onClear();
  }

  onClear(){
    this.isAdd = true;
    this.cleared.emit(null);
  }

}
