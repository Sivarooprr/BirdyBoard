class NoticeAddPublicFlag < ActiveRecord::Migration[6.0]
  def change
    add_column :notices, :is_public, :boolean, default: false
  end
end
