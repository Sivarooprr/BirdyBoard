class CreateNotices < ActiveRecord::Migration[6.0]
  def change
    create_table :notices do |t|
      t.text :content
      t.boolean :published
      t.datetime :published_at

      t.timestamps
    end
  end
end
