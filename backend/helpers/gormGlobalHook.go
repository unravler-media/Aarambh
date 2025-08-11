package helpers

import (
	"backend/middlewares"
	"fmt"

	"gorm.io/gorm"
)

func WipeCacheGlobalHook(db *gorm.DB) {
	// Global After Create hook
	createErr := db.Callback().
		Create().
		After("gorm:create").
		Register("wipeRedis_after_create", func(tx *gorm.DB) {
			fmt.Println("[Global Hook] A record was created:", tx.Statement.Model)
			err := middlewares.InvalidateCacheCompletely()
			if err != nil {
				panic("Unable to clear Redis!")
			}
		})
	if createErr != nil {
		panic("Unable to run Gorm Lifecycle Hook")
	}

	// Global After Update hook
	updateErr := db.Callback().
		Update().
		After("gorm:update").
		Register("wipeRedis_after_update", func(tx *gorm.DB) {
			fmt.Println("[Global Hook] A record was updated:", tx.Statement.Model)
			err := middlewares.InvalidateCacheCompletely()
			if err != nil {
				panic("Unable to clear Redis!")
			}
		})

	if updateErr != nil {
		panic("Unable to run Gorm Lifecycle Hook")
	}

	// Global After Delete hook
	deleteErr := db.Callback().
		Delete().
		After("gorm:delete").
		Register("wipeRedis_after_update", func(tx *gorm.DB) {
			fmt.Println("[Global Hook] A record was deleted:", tx.Statement.Model)
			err := middlewares.InvalidateCacheCompletely()
			if err != nil {
				panic("Unable to clear Redis!")
			}
		})
	if deleteErr != nil {
		panic("unable to run GORM Lifecycle Hook")
	}
}
