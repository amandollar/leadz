# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_12_183138) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string "activity_type", null: false
    t.datetime "created_at", null: false
    t.bigint "lead_id", null: false
    t.text "notes", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["lead_id"], name: "index_activities_on_lead_id"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "audit_logs", force: :cascade do |t|
    t.string "action", null: false
    t.datetime "created_at", null: false
    t.text "metadata"
    t.bigint "trackable_id", null: false
    t.string "trackable_type", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["trackable_type", "trackable_id"], name: "index_audit_logs_on_trackable_type_and_trackable_id"
    t.index ["user_id"], name: "index_audit_logs_on_user_id"
  end

  create_table "follow_ups", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "due_date", null: false
    t.bigint "lead_id", null: false
    t.text "notes"
    t.string "status", default: "Pending", null: false
    t.datetime "updated_at", null: false
    t.index ["lead_id"], name: "index_follow_ups_on_lead_id"
  end

  create_table "leads", force: :cascade do |t|
    t.boolean "archived", default: false, null: false
    t.string "business_name", null: false
    t.string "city"
    t.string "contact_name"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "industry"
    t.text "notes"
    t.integer "owner_id"
    t.string "phone"
    t.string "stage", default: "New", null: false
    t.datetime "updated_at", null: false
    t.string "website"
    t.bigint "workspace_id", null: false
    t.index ["owner_id"], name: "index_leads_on_owner_id"
    t.index ["workspace_id"], name: "index_leads_on_workspace_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.boolean "must_change_password", default: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.string "role", null: false
    t.string "temporary_password"
    t.datetime "updated_at", null: false
    t.bigint "workspace_id", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["workspace_id"], name: "index_users_on_workspace_id"
  end

  create_table "workspaces", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "activities", "leads"
  add_foreign_key "activities", "users"
  add_foreign_key "audit_logs", "users"
  add_foreign_key "follow_ups", "leads"
  add_foreign_key "leads", "users", column: "owner_id"
  add_foreign_key "leads", "workspaces"
  add_foreign_key "users", "workspaces"
end
