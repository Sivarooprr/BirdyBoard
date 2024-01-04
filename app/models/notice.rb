class Notice < ApplicationRecord

    has_many :post_likes, dependent: :destroy
    has_many :notice_comments, dependent: :destroy

    LISTING_COLUMNS = %w[id content published published_at is_public created_at updated_at].freeze
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
            order("#{Notice::LISTING_COLUMNS[order_column_index]} #{order_dir}")
        end
    end

end
