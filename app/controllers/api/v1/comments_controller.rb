module Api::V1
  class CommentsController < ApplicationController
    # GET /api/v1/movies/:movie_id/comments
    def index
      movie = Movie.find(params[:movie_id])
      comments = movie.comments.order(created_at: :desc)
      render_success(comments.as_json(methods: [:author_display_name]))
    end

    # POST /api/v1/movies/:movie_id/comments
    def create
      movie = Movie.find(params[:movie_id])
      comment = movie.comments.new(comment_params)
      
      if comment.save
        render_success(comment.as_json(methods: [:author_display_name]), :created)
      else
        render_errors(comment.errors.full_messages)
      end
    end

    # PATCH/PUT /api/v1/movies/:movie_id/comments/1
    def update
      comment = Comment.find(params[:id])
      
      if comment.update(comment_params)
        render_success(comment.as_json(methods: [:author_display_name]))
      else
        render_errors(comment.errors.full_messages)
      end
    end

    # DELETE /api/v1/movies/:movie_id/comments/1
    def destroy
      comment = Comment.find(params[:id])
      comment.destroy
      head :no_content
    end

    private

    def comment_params
      params.require(:comment).permit(:content, :user_id)
    end
  end
end