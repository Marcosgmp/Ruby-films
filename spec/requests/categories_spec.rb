# spec/requests/categories_spec.rb
require 'swagger_helper'

RSpec.describe 'Categories API', type: :request do
  let!(:test_category) { Category.create(name: 'Action') }

  path '/api/v1/categories' do
    get 'Lista todas as categorias' do
      tags 'Categories'
      produces 'application/json'

      response '200', 'categories found' do
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['success']).to be true
        end
      end
    end

    post 'Cria uma nova categoria' do
      tags 'Categories'
      consumes 'application/json'
      parameter name: :category_params, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string }
        },
        required: ['name']
      }

      response '201', 'category created' do
        let(:category_params) { { name: 'Comedy' } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:category_params) { { name: '' } }
        run_test!
      end
    end
  end

  path '/api/v1/categories/{id}' do
    parameter name: :id, in: :path, type: :string

    get 'Mostra uma categoria específica' do
      tags 'Categories'
      produces 'application/json'

      response '200', 'category found' do
        let(:id) { test_category.id }
        run_test!
      end

      response '404', 'category not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end

    put 'Atualiza uma categoria' do
      tags 'Categories'
      consumes 'application/json'
      parameter name: :category_params, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string }
        }
      }

      response '200', 'category updated' do
        let(:id) { test_category.id }
        let(:category_params) { { name: 'Updated Action' } }
        run_test!
      end

      response '404', 'category not found' do
        let(:id) { 'invalid' }
        let(:category_params) { { name: 'Updated Action' } }
        run_test!
      end
    end

    delete 'Exclui uma categoria' do
      tags 'Categories'

      response '204', 'category deleted' do
        let(:id) { test_category.id }
        run_test!
      end

      response '404', 'category not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end
end