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

		// update
		edit_users := &schema.SchemaField{}
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
		}`), edit_users)
		collection.Schema.AddField(edit_users)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("068tvr5l1aaw2if")
		if err != nil {
			return err
		}

		// update
		edit_users := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "egonxbli",
			"name": "field",
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
		}`), edit_users)
		collection.Schema.AddField(edit_users)

		return dao.SaveCollection(collection)
	})
}
