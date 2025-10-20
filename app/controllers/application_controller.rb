class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  
  respond_to :json

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :parameter_missing

  def render_success(data = {}, status = :ok)
    render json: { success: true, data: data }, status: status
  end

  def render_error(message, status = :unprocessable_entity)
    render json: { success: false, error: message }, status: status
  end

  def render_errors(messages, status = :unprocessable_entity)
    render json: { success: false, errors: messages }, status: status
  end

  private

  def record_not_found(exception)
    render_error("Registro não encontrado: #{exception.message}", :not_found)
  end

  def record_invalid(exception)
    render_errors(exception.record.errors.full_messages)
  end

  def parameter_missing(exception)
    render_error("Parâmetro obrigatório faltando: #{exception.param}", :bad_request)
  end
end