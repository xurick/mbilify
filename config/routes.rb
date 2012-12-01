Mb::Application.routes.draw do
  get "site/create"

  get "site/show"

  root to: 'main#index'

  get "main/index"

  get "main/dashboard"
end
