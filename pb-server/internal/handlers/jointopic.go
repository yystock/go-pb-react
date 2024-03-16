package handlers // Replace with your actual package name

import (
	"net/http"

	"github.com/labstack/echo/v5" // Use the correct import for your router
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
)


func JoinTopicHandler(app *pocketbase.PocketBase, c echo.Context) error {

        // Get the authenticated user ID
		requestData := apis.RequestInfo(c)
		topicID := requestData.Data["topicId"].(string)

        // Get the topic ID from the request parameters
	

        // Check if the topic exists	
        topic, err := app.Dao().FindRecordById("topics", topicID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "Failed to find topic",
			})
		}
		membersValue := topic.Get("members")
		members, ok := membersValue.([]string)
		if !ok {
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "Failed to get members",
			})
		}

        // Insert the user ID to the topic.members field
		topic.Set("members", append(members, requestData.AuthRecord.Id))

    
        // Save the updated topic entry
        if err := app.Dao().SaveRecord(topic); err != nil {
            return c.JSON(http.StatusInternalServerError, echo.Map{
                "error": "Failed to join topic",
            })
        }

        return c.JSON(http.StatusOK, echo.Map{
            "message": "Joined topic successfully",
        })
    }
