package common

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Paginate(ctx *fiber.Ctx) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		// using strconv's Atoi function will parse our input as int. will give error if input is not an int.
		page, _ := strconv.Atoi(ctx.Query("page")) // get the page number.
		if page <= 0 {
			page = 1
		}

		pageSize, _ := strconv.Atoi(
			ctx.Query("pagesize"),
		) // get the number of results we require per page
		switch {
		case pageSize > 20:
			pageSize = 20
		case pageSize <= 0:
			pageSize = 10
		}

		// Offset basically defines the number of results to skip.
		// if we have 20 posts. and we already have 10 latest.
		// we need to get the other 10 so the offset will be 10
		// thus db will skip the starting 10 posts and give us the rest and will come with a limit respecting the pageSize value.

		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)

		// to use this paginate function. run your queries like this:
		// db.Scopes(Pagenate(c <- has the fiber ctx pointer)).Find() // continue rest of the query.
		// only focus on the Scopes aspect.
	}
}
