package models

import (
	"strings"
	"time"

	"github.com/matoous/go-nanoid/v2"
	"gorm.io/gorm"
)

type Category struct {
	ID string `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Name string `gorm:"index"`
	Slug string `gorm:"index"`
	Description string
	UserID string
	User Users `json:"user" gorm:"foreignKey:UserID"`
}

// This is GormHooks and will run before running the Transaction to Write to DB.
func (c *Category) BeforeCreate(tx *gorm.DB) (err error) {
	// instead of UUID we are using NanoID for efficiency.
	nanoid_id, err := gonanoid.New()
	if err != nil {
		return err
	}

	c.ID = nanoid_id

	// handle slug screation
	slug := strings.ToLower(c.Name)
	c.Slug = strings.ReplaceAll(slug," ", "-") // replace Empty space with -
	return nil
}
