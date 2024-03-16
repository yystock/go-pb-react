package main

import (
	"log"
	"os"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/yystock/go-react/internal/handlers"
	_ "github.com/yystock/go-react/migrations"
)
func main(){
	app := pocketbase.New()

    isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
        // enable auto creation of migration files when making collection changes in the Admin UI
        // (the isGoRun check is to enable it only during development)
        Automigrate: isGoRun,
    })

    // serves static files from the provided public dir (if exists)
    app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
        e.Router.GET("/api/hello", func(c echo.Context) error {
            return c.String(200, "Hello world!")
        }, apis.ActivityLogger(app), apis.RequireGuestOnly())

        e.Router.PUT("/api/jointopic", func(c echo.Context) error {
			return handlers.JoinTopicHandler(app, c)
		}, apis.ActivityLogger(app))
        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}