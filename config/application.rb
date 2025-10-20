require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    config.autoload_lib(ignore: %w[assets tasks])

    config.api_only = true
  end
end
