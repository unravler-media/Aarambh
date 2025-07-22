package models

import "time"

type Post struct {
	ID string `gorm:"primaryKey"`
	CreatedAi time.Time
	UpdatedAt time.Time
	PostTitle string `json:"post_title" gorm:"index" validate:"required,min=4"`
	Slug string
	ShortContent string `json:"short_content"`
	Content string `json:"content" validate:"required,min=128"`
	CoverImage string `json:"conver_image"`
	AuthorID string `json:"author_id"`
	Author Users `gorm:"foreignKey:AuthorID"`
	CategoryID string `json:"category_id"`
	Category Category `gorm:"foreignKey:CategoryID"`
	ReadTime string `json:"read_time"`
	IsFeatured bool `json:"is_featured"`
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
