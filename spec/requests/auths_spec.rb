# spec/requests/auth_spec.rb
require 'swagger_helper'

RSpec.describe 'Authentication API', type: :request do
  let!(:user) { User.create(email: 'test@example.com', password: 'password', name: 'Test User') }

  path '/api/v1/auth/login' do
    post 'Login do usuário' do
      tags 'Authentication'
      consumes 'application/json'
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          password: { type: :string }
        },
        required: ['email', 'password']
      }

      response '200', 'login successful' do
        let(:credentials) { { email: 'test@example.com', password: 'password' } }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(response).to have_http_status(:ok)
        end
      end

      response '401', 'invalid credentials' do
        let(:credentials) { { email: 'test@example.com', password: 'wrong' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/register' do
    post 'Registro de novo usuário' do
      tags 'Authentication'
      consumes 'application/json'
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          email: { type: :string },
          password: { type: :string },
          password_confirmation: { type: :string }
        },
        required: ['name', 'email', 'password']
      }

      response '201', 'user created' do
        let(:user_params) { 
          { 
            name: 'New User', 
            email: 'new@example.com', 
            password: 'password',
            password_confirmation: 'password'
          } 
        }
        run_test!
      end

      response '422', 'invalid request' do
        let(:user_params) { { name: '', email: '', password: '' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/logout' do
    delete 'Logout do usuário' do
      tags 'Authentication'

      response '200', 'logout successful' do
        run_test!
      end
    end
  end
end