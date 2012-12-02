Mb::Application.routes.draw do
  root to: 'main#index'

  post "site/create"

  get "site/show"

  get "main/index"

  get "main/dashboard"
end
