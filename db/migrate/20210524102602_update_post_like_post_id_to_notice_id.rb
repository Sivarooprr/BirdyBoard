class UpdatePostLikePostIdToNoticeId < ActiveRecord::Migration[6.0]
  def change
    rename_column :post_likes, :post_id, :notice_id
  end
end
