module Api::V1
  class MoviesController < ApplicationController
    # GET /api/v1/movies
    def index
      movies = Movie.all.order(created_at: :desc)
      render_success(movies.as_json(include: [:user, :categories, comments: { methods: [:author_display_name] }]))
    end

    # GET /api/v1/movies/1
    def show
      movie = Movie.find(params[:id])
      render_success(movie.as_json(
        include: [
          :user,
          :categories,
          comments: { 
            methods: [:author_display_name]
          }
        ]
      ))
    end

    # POST /api/v1/movies
    def create
      movie = Movie.new(movie_params)
      
      if movie.save
        render_success(movie, :created)
      else
        render_errors(movie.errors.full_messages)
      end
    end

    # PATCH/PUT /api/v1/movies/1
    def update
      movie = Movie.find(params[:id])
      
      if movie.update(movie_params)
        render_success(movie)
      else
        render_errors(movie.errors.full_messages)
      end
    end

    # DELETE /api/v1/movies/1
    def destroy
      movie = Movie.find(params[:id])
      movie.destroy
      head :no_content
    end

    private

    def movie_params
      params.require(:movie).permit(:title, :synopsis, :release_year, :duration, :director, :user_id, category_ids: [])
    end
  end
end