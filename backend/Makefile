main_package_path = ./
binary_name = production_build
output_dir = ./bin

.Phony: build
build:
	@mkdir -p ${output_dir}
	GOARCH=amd64 GOOS=darwin go build -ldflags="-s -w -X main.version=1.0.0" -o ${output_dir}/${binary_name}-darwin ${main_package_path}
	GOARCH=amd64 GOOS=linux go build -ldflags="-s -w -X main.version=1.0.0" -o ${output_dir}/${binary_name}-linux ${main_package_path}
	GOARCH=amd64 GOOS=windows go build -ldflags="-s -w -X main.version=1.0.0" -o ${output_dir}/${binary_name}-windows.exe ${main_package_path}

.PHONY: gcp
gcp:
	@echo "Deploying to Google Cloud Platform - ServerLess functions"
	@echo "Preparing the container image:"
	gcloud builds submit --tag gcr.io/aarambh-unravlermedia/aarambh-server
	@echo "Deploying the container to ServerLess Functions:"
	gcloud run deploy aarambh-server --image gcr.io/aarambh-unravlermedia/aarambh-server --platform managed --region asia-south2
	@echo "GCP Cloud Function	s Deployment LifeCycle Completed!"
