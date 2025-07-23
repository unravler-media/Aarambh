package models

import (
	"strings"
	"time"
	"fmt"

	gonanoid "github.com/matoous/go-nanoid/v2"
	"gorm.io/gorm"

	"backend/helpers"
)

type Post struct {
	ID string `gorm:"primaryKey"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	PostTitle string `json:"post_title" gorm:"index" validate:"required,min=4"`
	Slug string `gorm:"index"`
	ShortContent string `json:"short_content"`
	Content string `json:"content" validate:"required,min=128"`
	CoverImage string `json:"cover_image"`
	AuthorID string `json:"author_id"`
	Author Users `gorm:"foreignKey:AuthorID"`
	CategoryID string `json:"category_id"`
	Category Category `gorm:"foreignKey:CategoryID"`
	ReadTime string `json:"read_time"`
	IsFeatured bool `json:"is_featured"`
}

// Creating Hooks for Post Model
func(c *Post) BeforeCreate(tx *gorm.DB) (err error) {
	// nanoid generation for ID of Post
	nanoid_id, err := gonanoid.New()
	c.ID = nanoid_id
	slug := strings.ToLower(c.PostTitle)
	c.Slug = strings.ToLower(slug)

	// Calculate readTime of a Post
	readTime := fmt.Sprintf("Estimated read time: %d minute(s)", helpers.CalculateReadTime(c.Content))
	c.ReadTime = readTime

	current_time := time.Now()
	c.CreatedAt = current_time.Format("Jan 2, 2006 at 3:04pm")
	c.UpdatedAt = current_time.Format("Jan 2, 2006 at 3:04pm")
	return nil
}

// for future implementations
type PostLike struct {
	ID string `gorm:"primaryKey"`
	CreatedAi time.Time
	UpdatedAt time.Time
	LikedByUser string `json:"liked_by_user"`
	LikedBy Users `gorm:"foreignKey:LikedByUser"`
	PostID string `json:"post_id"`
	Post Post `gorm:"foreignKey:PostID"`
}

type PostView struct {
	ID string `gorm:"primaryKey"`
	CreatedAi time.Time
	ViewedByUser string `json:"viewed_by_user"`
	ViewedBy Users `gorm:"foreignKey:ViewedByUser"`
	ViewedPostID string `json:"viewed_post_id"`
	ViewedPost Post `gorm:"foreignKey:ViewedPostID"`
	IsAnonymous bool `json:"is_anonymous" gorm:"index"`
}
