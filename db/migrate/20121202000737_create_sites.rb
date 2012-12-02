class CreateSites < ActiveRecord::Migration
  def change
    create_table :sites do |t|
      t.string :url
      t.string :logo_img
      t.string :nav_menu
      t.text :content

      t.timestamps
    end
  end
end
