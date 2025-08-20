package models

import (
	"fmt"
	"strings"
	"time"

	gonanoid "github.com/matoous/go-nanoid/v2"
	"gorm.io/gorm"

	"backend/helpers"
)

type Post struct {
	ID           string    `gorm:"primaryKey"              json:"id"`
	CreatedAt    time.Time `                               json:"created_at"`
	UpdatedAt    time.Time `                               json:"updated_at"`
	PostTitle    string    `gorm:"index"                   json:"post_title"    validate:"required,min=4"`
	Slug         string    `gorm:"index"`
	ShortContent string    `                               json:"short_content"`
	Content      string    `                               json:"content"       validate:"required,min=128"`
	CoverImage   string    `                               json:"cover_image"`
	AuthorID     string    `                               json:"author_id"`
	Author       Users     `gorm:"foreignKey:AuthorID"`
	CategoryID   string    `                               json:"category_id"`
	Category     Category  `gorm:"foreignKey:CategoryID"`
	ReadTime     string    `                               json:"read_time"`
	IsFeatured   bool      `                               json:"is_featured"`
	// Creating reverse relation to Comments to Preload in future
	Comments   []Comment    `gorm:"foreignKey:PostID"`
	PostLikes  []PostLike   `gorm:"foreignKey:PostID"`
	PostViews  []PostView   `gorm:"foreignKey:ViewedPostID"`
	PostsSaved []SavedPosts `gorm:"foreignKey:SavedPostID"`
	// PostID is what we used in COmments Model to refrence into this Model
}

// Creating Hooks for Post Model
func (c *Post) BeforeCreate(tx *gorm.DB) (err error) {
	// nanoid generation for ID of Post
	nanoid_id, _ := gonanoid.New()
	c.ID = nanoid_id
	slug := strings.ToLower(c.PostTitle)
	c.Slug = strings.ReplaceAll(slug, " ", "-")

	// Calculate readTime of a Post
	readTime := fmt.Sprintf(
		"Estimated read time: %d minute(s)",
		helpers.CalculateReadTime(c.Content),
	)
	c.ReadTime = readTime
	return nil
}

func (c *Post) BeforeUpdate(tx *gorm.DB) (err error) {
	readTime := fmt.Sprintf(
		"Estimated read time: %d minute(s)",
		helpers.CalculateReadTime(c.Content),
	)
	c.ReadTime = readTime
	return nil
}

// for future implementations
type PostLike struct {
	ID          string    `gorm:"primaryKey"`
	CreatedAt   time.Time `                              json:"created_at"`
	UpdatedAt   time.Time `                              json:"updated_at"`
	LikedByUser string    `                              json:"liked_by_user"`
	LikedBy     Users     `gorm:"foreignKey:LikedByUser"`
	PostID      string    `                              json:"post_id"`
	Post        Post      `gorm:"foreignKey:PostID"`
}

// Creating Hooks for PostLike Model
func (c *PostLike) BeforeCreate(tx *gorm.DB) (err error) {
	// nanoid generation for ID of Post
	nanoid_id, _ := gonanoid.New()
	c.ID = nanoid_id
	return nil
}

type PostView struct {
	ID           string    `gorm:"primaryKey"`
	CreatedAt    time.Time `                               json:"created_at"`
	UpdatedAt    time.Time `                               json:"updated_at"`
	ViewedByUser string    `                               json:"viewed_by_user"`
	ViewedBy     Users     `gorm:"foreignKey:ViewedByUser"`
	ViewedPostID string    `                               json:"viewed_post_id"`
	ViewedPost   Post      `gorm:"foreignKey:ViewedPostID"`
}

// Creating Hooks for PostView Model
func (c *PostView) BeforeCreate(tx *gorm.DB) (err error) {
	// nanoid generation for ID of Post
	nanoid_id, _ := gonanoid.New()
	c.ID = nanoid_id
	return nil
}

type SavedPosts struct {
	ID          string    `gorm:"primaryKey"`
	CreatedAt   time.Time `                              json:"created_at"`
	UpdatedAt   time.Time `                              json:"updated_at"`
	SavedByUser string    `                              json:"saved_by_user"`
	SavedBy     Users     `gorm:"foreignKey:SavedByUser"`
	SavedPostID string    `                              json:"saved_post_id"`
	SavedPost   Post      `gorm:"foreignKey:SavedPostID"`
}

// Creating Hooks for SavedPosts Model
func (c *SavedPosts) BeforeCreate(tx *gorm.DB) (err error) {
	// nanoid generation for ID of Post
	nanoid_id, _ := gonanoid.New()
	c.ID = nanoid_id
	return nil
}
