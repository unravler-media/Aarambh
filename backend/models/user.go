package models

import (
	"fmt"
	"time"

	"github.com/matoous/go-nanoid/v2"
	"gorm.io/gorm"
)

type Users struct {
	ID string `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Username string
	Password []byte `json"-"` // field is excluded from JSON encoding to prevent it from being exposed.
	FullName string `json:"full_name"`
	Avatar string
	Bio string 
	Role string // options: creator, member, admin
	Email string
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
