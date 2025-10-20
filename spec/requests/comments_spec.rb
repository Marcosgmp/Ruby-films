# spec/requests/comments_spec.rb
require 'swagger_helper'

RSpec.describe 'Comments API', type: :request do
  let(:user) { User.create(email: 'user@example.com', password: 'password', name: 'Test User') }
  let(:movie) { 
    Movie.create(
      title: 'Test Movie', 
      user: user, 
      release_year: 2023, 
      duration: 120, 
      director: 'Director',
      synopsis: 'Test synopsis'
    ) 
  }
  let!(:test_comment) { 
    Comment.create(
      content: 'Great movie!', 
      user: user, 
      movie: movie  # CORRIGIDO: estava sem movie
    ) 
  }

  path '/api/v1/movies/{movie_id}/comments' do
    parameter name: :movie_id, in: :path, type: :string

    get 'Lista todos os comentários de um filme' do
      tags 'Comments'
      produces 'application/json'

      response '200', 'comments found' do
        let(:movie_id) { movie.id }
        run_test!
      end

      response '404', 'movie not found' do
        let(:movie_id) { 'invalid' }
        run_test!
      end
    end

    post 'Cria um novo comentário' do
      tags 'Comments'
      consumes 'application/json'
      parameter name: :comment_params, in: :body, schema: {
        type: :object,
        properties: {
          content: { type: :string },
          user_id: { type: :integer }
        },
        required: ['content', 'user_id']
      }

      response '201', 'comment created' do
        let(:movie_id) { movie.id }
        let(:comment_params) { { content: 'Amazing film!', user_id: user.id } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:movie_id) { movie.id }
        let(:comment_params) { { content: '' } }
        run_test!
      end
    end
  end

  path '/api/v1/movies/{movie_id}/comments/{id}' do
    parameter name: :movie_id, in: :path, type: :string
    parameter name: :id, in: :path, type: :string

    put 'Atualiza um comentário' do
      tags 'Comments'
      consumes 'application/json'
      parameter name: :comment_params, in: :body, schema: {
        type: :object,
        properties: {
          content: { type: :string }
        }
      }

      response '200', 'comment updated' do
        let(:movie_id) { movie.id }
        let(:id) { test_comment.id }
        let(:comment_params) { { content: 'Updated comment!' } }
        run_test!
      end

      response '404', 'comment not found' do
        let(:movie_id) { movie.id }
        let(:id) { 'invalid' }
        let(:comment_params) { { content: 'Updated comment!' } }
        run_test!
      end
    end

    delete 'Exclui um comentário' do
      tags 'Comments'

      response '204', 'comment deleted' do
        let(:movie_id) { movie.id }
        let(:id) { test_comment.id }
        run_test!
      end

      response '404', 'comment not found' do
        let(:movie_id) { movie.id }
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end
end