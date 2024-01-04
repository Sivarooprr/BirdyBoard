class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable, :trackable

  has_many :post_likes
  has_many :notice_comments

  LISTING_COLUMNS = %w[id first_name last_name email department semester is_admin is_verified created_at updated_at].freeze
  class << self
    def datatable_filter(search_value, search_columns)
      return all if search_value.blank?

      result = none
      search_columns.each do |key, value|
        filter = where("#{LISTING_COLUMNS[key.to_i]} LIKE ?", "%#{search_value}%")
        result = result.or(filter) if value['searchable'] == "true"
      end
      result
    end

    def datatable_order(order_column_index, order_dir)
      order("#{User::LISTING_COLUMNS[order_column_index]} #{order_dir}")
    end
  end

end
