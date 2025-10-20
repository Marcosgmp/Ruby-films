ActiveRecord::Schema[8.0].define(version: 2025_10_19_201742) do

  enable_extension "pg_catalog.plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.bigint "movie_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["movie_id"], name: "index_comments_on_movie_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "films", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.date "release_date"
    t.integer "duration"
    t.decimal "rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "movie_categories", force: :cascade do |t|
    t.bigint "movie_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_movie_categories_on_category_id"
    t.index ["movie_id", "category_id"], name: "index_movie_categories_on_movie_and_category", unique: true
    t.index ["movie_id"], name: "index_movie_categories_on_movie_id"
  end

  create_table "movies", force: :cascade do |t|
    t.string "title", null: false
    t.text "synopsis"
    t.integer "release_year", null: false
    t.integer "duration", null: false
    t.string "director"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "rating", precision: 3, scale: 1
    t.index ["release_year"], name: "index_movies_on_release_year"
    t.index ["title"], name: "index_movies_on_title"
    t.index ["user_id"], name: "index_movies_on_user_id"
    t.check_constraint "duration > 0", name: "movies_duration_check"
    t.check_constraint "release_year >= 1880 AND release_year::numeric <= EXTRACT(year FROM CURRENT_DATE)", name: "movies_release_year_check"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "comments", "movies"
  add_foreign_key "comments", "users"
  add_foreign_key "movie_categories", "categories"
  add_foreign_key "movie_categories", "movies"
  add_foreign_key "movies", "users"
end
