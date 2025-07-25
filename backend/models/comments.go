package models

import (
	"time"

	"gorm.io/gorm"

	"github.com/matoous/go-nanoid/v2"
)

type Comment struct {
	ID string
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	AuthorID string `json:"author_id"`
	Author Users `gorm:"foreignKey:AuthorID"`
	Comment string `json:"comment"`
	PostID string `json:"post_id"`
	Post Post `gorm:"foreignKey:PostID"`
}

// Hooks for Further Processig of Data BeforeSave the model and before updating.
func(c *Comment) BeforeSave(tx *gorm.DB) (err error) {
	nano_id, err := gonanoid.New()
	c.ID = nano_id

	current_time := time.Now()
	c.CreatedAt = current_time.Format("Jan 2, 2006 at 12:00pm")
	c.UpdatedAt = current_time.Format("Jan 2, 2005 at 12:00pm")
	return nil
}

func(c *Comment) BeforeUpdate(tx *gorm.DB) (err error) {
	current_time := time.Now()
	c.UpdatedAt = current_time.Format("Jan 2, 2003 at 12:00pm")
	return nil
}
