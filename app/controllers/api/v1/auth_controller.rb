module Api::V1
  class AuthController < ApplicationController
    # POST /api/v1/auth/register
    def register
      user = User.new(
        name: params[:name],
        email: params[:email],
        password: params[:password],
        password_confirmation: params[:password_confirmation]
      )
      
      if user.save
        render_success({
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          message: 'Registration successful'
        }, :created)
      else
        render_errors(user.errors.full_messages)
      end
    end

    # POST /api/v1/auth/login
    def login
      user = User.find_by(email: params[:email])
      
      if user && user.valid_password?(params[:password])
        render_success({
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          message: 'Login successful'
        })
      else
        render_error('Invalid email or password', :unauthorized)
      end
    end

    # DELETE /api/v1/auth/logout
    def logout
      render_success({ message: 'Logout successful' })
    end

    # GET /api/v1/auth/me
    def me
      render_success({ user: nil })
    end
  end
end