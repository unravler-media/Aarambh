package models

import (
	"gorm.io/gorm"
	"time"
	"github.com/matoous/go-nanoid/v2"
)

type Category struct {
	ID string `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Name string `gorm:"index"`
	Slug string `gorm:"index"`
	Description string
	post_count int
}

func (c *Category) BeforeCreate(tx *gorm.DB) (err error) {
	nanoid_id, err := gonanoid.New()
	if err != nil {
		return err
	}

	c.ID = nanoid_id
	return nil
}
