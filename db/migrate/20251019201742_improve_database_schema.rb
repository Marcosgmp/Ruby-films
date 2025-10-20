class ImproveDatabaseSchema < ActiveRecord::Migration[8.0]
  def change
    # 1. Adicionar rating aos movies (novo campo)
    add_column :movies, :rating, :decimal, precision: 3, scale: 1
    
    # 2. Adicionar índices que faltam
    add_index :movies, :title unless index_exists?(:movies, :title)
    add_index :movies, :release_year unless index_exists?(:movies, :release_year)
    add_index :comments, :movie_id unless index_exists?(:comments, :movie_id)
    add_index :comments, :user_id unless index_exists?(:comments, :user_id)
    
    # Índice único composto para evitar duplicatas em movie_categories
    unless index_exists?(:movie_categories, [:movie_id, :category_id])
      add_index :movie_categories, [:movie_id, :category_id], unique: true,
                name: 'index_movie_categories_on_movie_and_category'
    end
    
    # 3. Adicionar constraints NOT NULL apenas se necessário
    change_column_null :movies, :title, false
    change_column_null :movies, :release_year, false
    change_column_null :movies, :duration, false
    change_column_null :categories, :name, false
    
    # 4. Adicionar constraint para release_year
    execute <<-SQL
      ALTER TABLE movies 
      ADD CONSTRAINT movies_release_year_check 
      CHECK (release_year >= 1880 AND release_year <= EXTRACT(YEAR FROM CURRENT_DATE))
    SQL
    
    # 5. Adicionar constraint para duration
    execute <<-SQL
      ALTER TABLE movies 
      ADD CONSTRAINT movies_duration_check 
      CHECK (duration > 0)
    SQL
  end
end