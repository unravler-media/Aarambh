package helpers

import (
	"context"
	"fmt"
	"os"

	"bytes"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type R2Client struct {
	Client     *s3.Client
	BucketName string
}

func BucketLoader() (*R2Client, error) {
	accessKey := os.Getenv("R2AccessID")
	accessSecret := os.Getenv("R2AccessKey")
	accountID := os.Getenv("R2AccountID")
	bucketName := os.Getenv("R2BucketName")

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithCredentialsProvider(
		credentials.NewStaticCredentialsProvider(accessKey, accessSecret, ""),
	), config.WithRegion("auto"))

	if err != nil {
		panic("Config Error")
	}

	client := s3.NewFromConfig(cfg, func(opt *s3.Options) {
		opt.BaseEndpoint = aws.String(
			fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID),
		)
	})
	return &R2Client{
		Client:     client,
		BucketName: bucketName,
	}, nil
}

func (client *R2Client) R2Uploader(
	ctx context.Context,
	key string,
	data []byte,
	contentType string,
) (string, error) {
	_, err := client.Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &client.BucketName,
		Key:         &key,
		Body:        bytes.NewReader(data),
		ContentType: &contentType,
	})

	if err != nil {
		fmt.Println(err)
		panic("Cannot Upload Something went wrong.")
	}

	return fmt.Sprintf(
		"https://%s.r2.dev/%s",
		os.Getenv("R2PublicUrl"),
		key,
	), nil
}
