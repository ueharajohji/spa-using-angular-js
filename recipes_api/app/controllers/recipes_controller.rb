class RecipesController < ApplicationController
  before_action :set_recipe, only: [:show, :update, :destroy]

  # GET /recipes
  def index
    @recipes = Recipe.all

    render json: @recipes.as_json(include: { ingredients:
                                               { except:
                                                   [:id,:updated_at,:created_at,:recipe_id]
                                               }
                                           },
                                  except:
                                    [:id,
                                     :updated_at,
                                     :created_at]
                                 )
  end

  # GET /recipes/1
  def show
    render json: @recipe
  end

  # POST /recipes
  def create
    @recipe = Recipe.new(recipe_params)
    params[:recipe][:ingredients].each do |ing|
      ingredient = Ingredient.new(ing.permit(:name, :amount))
      @recipe.ingredients << ingredient
    end
    if @recipe.save
      #loop each ingredients here
      render json: @recipe, status: :created, location: @recipe
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /recipes/1
  def update
    if @recipe.update(recipe_params)
      render json: @recipe
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end

  # DELETE /recipes/1
  def destroy
    @recipe.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recipe
      @recipe = Recipe.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def recipe_params
      params.require(:recipe).permit(:name , :description, :imagePath)
    end

end