package logic

import (
	"backend/common"
	"backend/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

// This function will return couple of things
// liked_posts: int // total liked posts by the user in question
// liked_weekly: int or percentage // posts liked this week by the user in question
//
// comments: int // total comments posted by the user in question
// comments_weekly: int // comments made this week by the user in question
//
// saved_posts: int // total posts saved by the user in question
// saved_weekly: int // posts saved this week by the user in question
//
// posts_read: int // total posts read by the user in question
// read_weekly: int // total posts read this week by the user in question
//
// below will be sorted by latest to oldest.
// recently_liked_posts: []posts // total posts liked by the user in question [quantatity is 10] [allow pagination]
// posts_saved: []posts // total posts saved by the user in question [quantatity is 10] [allow pagination]
// comments_created: []comments // total comments by user on posts [quantatity is 10] [allow pagination]

// DTO struct for Author
type AuthorDTO struct {
	Username string `json:"Username"`
	FullName string `json:"full_name"`
	Avatar   string `json:"Avatar"`
}

// DTO struct for Recent Posts
type RecentPostDTO struct {
	UpdatedAt  string    `json:"updated_at"`
	PostTitle  string    `json:"post_title"`
	Slug       string    `json:"Slug"`
	CoverImage string    `json:"cover_image"`
	Author     AuthorDTO `json:"Author"`
}

// DTO struct for Comments Created by User
type CommentCreatedDTO struct {
	CommentID   string `json:"comment_id"`
	CommentText string `json:"comment_text"` // Updated field name
	CreatedAt   string `json:"created_at"`
	PostSlug    string `json:"post_slug"`
	PostTitle   string `json:"post_title"`
}

// Temporary struct for scanning raw SQL results
type RecentPostScanResult struct {
	UpdatedAt  string `json:"updated_at"`
	PostTitle  string `json:"post_title"`
	Slug       string `json:"slug"`
	CoverImage string `json:"cover_image"`
	Username   string `json:"username"`
	FullName   string `json:"full_name"`
	Avatar     string `json:"avatar"`
}

func MemberDashboard(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	userID := c.Locals("session_user").(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	lastWeek := time.Now().AddDate(0, 0, -7) // 7 days ago

	var (
		likedPostsCount, likedWeeklyCount    int64
		commentsCount, commentsWeeklyCount   int64
		savedPostsCount, savedWeeklyCount    int64
		postsReadCount, postsReadWeeklyCount int64
		recentlyLiked, recentlySaved         []RecentPostDTO
		commentsCreated                      []CommentCreatedDTO
	)

	// Counts
	db.Model(&models.PostLike{}).Where("liked_by_user = ?", userID).Count(&likedPostsCount)
	db.Model(&models.PostLike{}).
		Where("liked_by_user = ? AND created_at >= ?", userID, lastWeek).
		Count(&likedWeeklyCount)

	db.Model(&models.Comment{}).Where("author_id = ?", userID).Count(&commentsCount)
	db.Model(&models.Comment{}).
		Where("author_id = ? AND created_at >= ?", userID, lastWeek).
		Count(&commentsWeeklyCount)

	db.Model(&models.SavedPosts{}).Where("saved_by_user = ?", userID).Count(&savedPostsCount)
	db.Model(&models.SavedPosts{}).
		Where("saved_by_user = ? AND created_at >= ?", userID, lastWeek).
		Count(&savedWeeklyCount)

	db.Model(&models.PostView{}).Where("viewed_by_user = ?", userID).Count(&postsReadCount)
	db.Model(&models.PostView{}).
		Where("viewed_by_user = ? AND created_at >= ?", userID, lastWeek).
		Count(&postsReadWeeklyCount)

	// Recently liked posts
	var recentlyLikedScan []RecentPostScanResult
	db.Table("posts").
		Select(`posts.updated_at, posts.post_title, posts.slug, posts.cover_image,
		        users.username, users.full_name, users.avatar`).
		Joins("JOIN post_likes ON post_likes.post_id = posts.id").
		Joins("JOIN users ON users.id = posts.author_id").
		Where("post_likes.liked_by_user = ?", userID).
		Order("post_likes.created_at DESC").
		Limit(5).
		Scan(&recentlyLikedScan)

	// Map to RecentPostDTO for recently liked
	for _, item := range recentlyLikedScan {
		recentlyLiked = append(recentlyLiked, RecentPostDTO{
			UpdatedAt:  item.UpdatedAt,
			PostTitle:  item.PostTitle,
			Slug:       item.Slug,
			CoverImage: item.CoverImage,
			Author: AuthorDTO{
				Username: item.Username,
				FullName: item.FullName,
				Avatar:   item.Avatar,
			},
		})
	}

	// Recently saved posts
	var recentlySavedScan []RecentPostScanResult
	db.Table("posts").
		Select(`posts.updated_at, posts.post_title, posts.slug, posts.cover_image,
		        users.username, users.full_name, users.avatar`).
		Joins("JOIN saved_posts ON saved_posts.saved_post_id = posts.id").
		Joins("JOIN users ON users.id = posts.author_id").
		Where("saved_posts.saved_by_user = ?", userID).
		Order("saved_posts.created_at DESC").
		Limit(5).
		Scan(&recentlySavedScan)

	// Map to RecentPostDTO for recently saved
	for _, item := range recentlySavedScan {
		recentlySaved = append(recentlySaved, RecentPostDTO{
			UpdatedAt:  item.UpdatedAt,
			PostTitle:  item.PostTitle,
			Slug:       item.Slug,
			CoverImage: item.CoverImage,
			Author: AuthorDTO{
				Username: item.Username,
				FullName: item.FullName,
				Avatar:   item.Avatar,
			},
		})
	}

	// Comments created by user (last 10)
	db.Table("comments").
		Select(`comments.id as comment_id, comments.comment_text, comments.created_at,
		        posts.slug as post_slug, posts.post_title`).
		Joins("JOIN posts ON posts.id = comments.post_id").
		Where("comments.author_id = ?", userID).
		Order("comments.created_at DESC").
		Limit(10).
		Scan(&commentsCreated)

	// Final JSON output
	return c.JSON(fiber.Map{
		"comments_total":     commentsCount,
		"comments_weekly":    commentsWeeklyCount,
		"comments_created":   commentsCreated,
		"liked_posts_total":  likedPostsCount,
		"liked_posts_weekly": likedWeeklyCount,
		"posts_read_total":   postsReadCount,
		"posts_read_weekly":  postsReadWeeklyCount,
		"recently_liked":     recentlyLiked,
		"recently_saved":     recentlySaved,
		"saved_posts_total":  savedPostsCount,
		"saved_posts_weekly": savedWeeklyCount,
	})
}

// This function will return couple of things
// total_posts: int // total posts created by the user in question
// total_views: int // total views accumulated by the posts the user in question created.
// total_likes: int // total likes accumulated by the posts the user in question created.
// total_comments: int // total comments created on the posts the user in question creatod.
// recent_posts: []posts // 10 latest created posts by the user in question. [allow pagination]

// DTO for trimmed recent posts
type CreatorRecentPostDTO struct {
	PostTitle     string `json:"post_title"`
	Slug          string `json:"slug"`
	ViewsCount    int64  `json:"views_count"`
	LikesCount    int64  `json:"likes_count"`
	CommentsCount int64  `json:"comments_count"`
}

func CreatorDashboard(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	userID := c.Locals("session_user").(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)

	// Pagination params
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit

	var (
		totalPosts    int64
		totalViews    int64
		totalLikes    int64
		totalComments int64
		recentPosts   []CreatorRecentPostDTO
	)

	// Total posts created by the creator
	if err := db.Model(&models.Post{}).
		Where("author_id = ?", userID).
		Count(&totalPosts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get total posts"})
	}

	// Total views across all posts
	if err := db.Model(&models.PostView{}).
		Joins("JOIN posts ON posts.id = post_views.viewed_post_id").
		Where("posts.author_id = ?", userID).
		Count(&totalViews).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get total views"})
	}

	// Total likes across all posts
	if err := db.Model(&models.PostLike{}).
		Joins("JOIN posts ON posts.id = post_likes.post_id").
		Where("posts.author_id = ?", userID).
		Count(&totalLikes).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get total likes"})
	}

	// Total comments across all posts
	if err := db.Model(&models.Comment{}).
		Joins("JOIN posts ON posts.id = comments.post_id").
		Where("posts.author_id = ?", userID).
		Count(&totalComments).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get total comments"})
	}

	// Recent posts (only needed fields + aggregated counts)
	if err := db.Table("posts").
		Select(`
			posts.post_title,
			posts.slug,
			(SELECT COUNT(*) FROM post_views WHERE post_views.viewed_post_id = posts.id) AS views_count,
			(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id) AS likes_count,
			(SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments_count
		`).
		Where("posts.author_id = ?", userID).
		Order("posts.created_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&recentPosts).Error; err != nil {
		return common.InternalServerError(c, "Cannot Fetch Recent Posts")
	}

	// Final transformed JSON
	return c.JSON(fiber.Map{
		"limit":          limit,
		"page":           page,
		"recent_posts":   recentPosts,
		"total_comments": totalComments,
		"total_likes":    totalLikes,
		"total_posts":    totalPosts,
		"total_views":    totalViews,
	})
}

// TODO: Pending Implementation.
func AdminDashboard(c *fiber.Ctx) error {
	return nil
}
