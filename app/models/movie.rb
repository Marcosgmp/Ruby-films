class Movie < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :movie_categories, dependent: :destroy
  has_many :categories, through: :movie_categories

  validates :title, :synopsis, :release_year, :duration, :director, presence: true
  validates :release_year, numericality: { 
    only_integer: true, 
    greater_than: 1880, 
    less_than_or_equal_to: Date.today.year 
  }
  validates :duration, numericality: { 
    only_integer: true, 
    greater_than: 0 
  }
  validates :rating, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 10 
  }, allow_nil: true
  
  scope :newest_first, -> { order(created_at: :desc) }
  scope :by_year, ->(year) { where(release_year: year) }
  scope :recent, -> { where('release_year >= ?', Date.today.year - 5) }
  
  def self.search(query)
    where('title ILIKE ? OR director ILIKE ? OR synopsis ILIKE ?', 
          "%#{query}%", "%#{query}%", "%#{query}%")
  end
  
  def duration_in_hours
    "#{duration / 60}h #{duration % 60}min"
  end
end