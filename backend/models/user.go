package models

import (
	"fmt"
	"time"

	"github.com/matoous/go-nanoid/v2"
	"gorm.io/gorm"
)

type Users struct {
	ID string `json:"id" gorm:"primarykey"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Username string `gorm:"index" validate:"required,min=4"`
	Password string `json:"-" validate:"required,min=4"` // field is excluded from JSON encoding to prevent it from being exposed.
	FullName string `json:"full_name" gorm:"index"`
	Avatar string
	Bio string 
	Role string // options: creator, member, admin
	Email string `gorm:"index" validate:"required"`
	Posts []Post `gorm:"foreignKey:AuthorID"` // reverse relation to the Post model.
}

// Hook to auto add a id to all new created users.
func (u *Users) BeforeCreate(tx *gorm.DB) (err error) {
	nanoid_uuid, err := gonanoid.New()
	if err != nil {
		fmt.Println("Error while creating a nanoId: ", err)
		return err	
	}
	// if nanoid creation works fine, apply it to the model and return.
	u.ID = nanoid_uuid
	return nil
}
