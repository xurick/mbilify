Mb::Application.routes.draw do
  root to: 'main#index'

  get "main/index"

  get "main/dashboard"
end
