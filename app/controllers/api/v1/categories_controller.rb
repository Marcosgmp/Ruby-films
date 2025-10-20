module Api::V1
  class CategoriesController < ApplicationController
    # GET /api/v1/categories
    def index
      categories = Category.all.order(:name)
      render_success(categories)
    end

    # GET /api/v1/categories/1
    def show
      category = Category.find(params[:id])
      render_success(category.as_json(include: :movies))
    end

    # POST /api/v1/categories
    def create
      category = Category.new(category_params)

      if category.save
        render_success(category, :created)
      else
        render_errors(category.errors.full_messages)
      end
    end

    # PATCH/PUT /api/v1/categories/1
    def update
      category = Category.find(params[:id])
      
      if category.update(category_params)
        render_success(category)
      else
        render_errors(category.errors.full_messages)
      end
    end

    # DELETE /api/v1/categories/1
    def destroy
      category = Category.find(params[:id])
      category.destroy
      head :no_content
    end

    private

    def category_params
      params.require(:category).permit(:name)
    end
  end
end