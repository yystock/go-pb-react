package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("068tvr5l1aaw2if")
		if err != nil {
			return err
		}

		// add
		new_creator := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "qthhbtnn",
			"name": "creator",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_creator)
		collection.Schema.AddField(new_creator)

		// update
		edit_capacity := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1tl2c35e",
			"name": "capacity",
			"type": "number",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"noDecimal": false
			}
		}`), edit_capacity)
		collection.Schema.AddField(edit_capacity)

		// update
		edit_members := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "egonxbli",
			"name": "members",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": null,
				"displayFields": null
			}
		}`), edit_members)
		collection.Schema.AddField(edit_members)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("068tvr5l1aaw2if")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("qthhbtnn")

		// update
		edit_capacity := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1tl2c35e",
			"name": "participants",
			"type": "number",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"noDecimal": false
			}
		}`), edit_capacity)
		collection.Schema.AddField(edit_capacity)

		// update
		edit_members := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "egonxbli",
			"name": "users",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": null,
				"displayFields": null
			}
		}`), edit_members)
		collection.Schema.AddField(edit_members)

		return dao.SaveCollection(collection)
	})
}
