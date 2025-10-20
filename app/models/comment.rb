class Comment < ApplicationRecord
  belongs_to :movie
  belongs_to :user

  validates :content, presence: true, length: { maximum: 1000 }

  def author_display_name
    user.name
  end
end