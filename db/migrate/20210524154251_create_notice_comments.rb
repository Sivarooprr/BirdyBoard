class CreateNoticeComments < ActiveRecord::Migration[6.0]
  def change
    create_table :notice_comments do |t|
      t.text :comment
      t.integer :user_id
      t.integer :notice_id

      t.timestamps
    end
  end
end
