# spec/requests/movies_spec.rb
require 'swagger_helper'

RSpec.describe 'Movies API', type: :request do
  let(:user) { User.create(email: 'test@example.com', password: 'password', name: 'Test User') }
  let!(:test_movie) {
    Movie.create(
      title: 'Test Movie', 
      synopsis: 'Test Synopsis', 
      release_year: 2023, 
      duration: 120, 
      director: 'Test Director',
      user: user
    ) 
  }

  path '/api/v1/movies' do
    get 'Lista todos os filmes' do
      tags 'Movies'
      produces 'application/json'

      response '200', 'movies found' do
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
          expect(data['success']).to be true
        end
      end
    end

    post 'Cria um novo filme' do
      tags 'Movies'
      consumes 'application/json'
      parameter name: :movie_params, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          synopsis: { type: :string },
          release_year: { type: :integer },
          duration: { type: :integer },
          director: { type: :string },
          user_id: { type: :integer },
          rating: { type: :number }
        },
        required: ['title', 'user_id']
      }

      response '201', 'movie created' do
        let(:movie_params) {
          { 
            title: 'New Movie', 
            synopsis: 'New Synopsis', 
            release_year: 2023, 
            duration: 120, 
            director: 'New Director',
            user_id: user.id,
            rating: 8.5
          } 
        }
        run_test!
      end

      response '422', 'invalid request' do
        let(:movie_params) { { title: '' } }
        run_test!
      end
    end
  end

  path '/api/v1/movies/{id}' do
    parameter name: :id, in: :path, type: :string

    get 'Mostra um filme específico' do
      tags 'Movies'
      produces 'application/json'

      response '200', 'movie found' do
        let(:id) { test_movie.id }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['success']).to be true
          expect(data['data']['title']).to eq('Test Movie')  # Corrigido aqui
        end
      end

      response '404', 'movie not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end

    put 'Atualiza um filme' do
      tags 'Movies'
      consumes 'application/json'
      parameter name: :movie_params, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          synopsis: { type: :string },
          release_year: { type: :integer },
          duration: { type: :integer },
          director: { type: :string },
          rating: { type: :number }
        }
      }

      response '200', 'movie updated' do
        let(:id) { test_movie.id }
        let(:movie_params) { { title: 'Updated Movie' } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['success']).to be true
        end
      end

      response '404', 'movie not found' do
        let(:id) { 'invalid' }
        let(:movie_params) { { title: 'Updated Movie' } }
        run_test!
      end
    end

    delete 'Exclui um filme' do
      tags 'Movies'

      response '204', 'movie deleted' do
        let(:id) { test_movie.id }
        run_test!
      end

      response '404', 'movie not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end
end