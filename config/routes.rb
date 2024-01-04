Rails.application.routes.draw do
  get 'admin/list_users'
  get 'admin/list_notices', as: :list_notices
  match 'admin/new_notice', to: 'admin#new_notice', via: [:get, :post]
  match 'admin/notice/:notice_id', to: 'admin#edit_notice', via: [:get, :post], as: :edit_notice

  get 'admin/api/get_user_listing', to: 'admin#get_user_listing'
  post 'admin/api/update_user', to: 'admin#update_user'

  get 'admin/api/get_notice_listing', to: 'admin#get_notice_listing'
  delete 'admin/api/notice/:notice_id', to: 'admin#delete_notice'
  get 'notice/:notice_id', to: 'home#notice_details'

  post 'api/notice/perform_action/:notice_id', to: 'home#notice_action'


  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations'
  }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'home#index'
end
