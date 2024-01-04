class PostLike < ApplicationRecord
  belongs_to :notice
  belongs_to :user
end
