FROM golang as build-go
WORKDIR /aarambh-server
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w -X main.version=1.0.0" -o /bin/aarambh-server .



FROM alpine:latest
RUN addgroup -S aarambh-server && adduser -S aarambh-server -G aarambh-server
USER aarambh-server
WORKDIR /home/aarambh-server
COPY --from=build-go /bin/aarambh-server ./
EXPOSE 8000

ENV turso_api=""
ENV secretKey=""
ENV REDIS_URL=""

ENTRYPOINT ["./aarambh-server"]
