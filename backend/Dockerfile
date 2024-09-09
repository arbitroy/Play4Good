FROM golang:1.18-alpine AS builder
WORKDIR /
# Copy go mod and sum files
COPY go.mod go.sum ./
# Download all dependencies
RUN go mod download
# Copy the source code
COPY . .
# Build the application
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
# Copy the binary from builder
COPY --from=builder /main .
# Copy the environment file
COPY app.env .
# Expose port
EXPOSE 8080
# Command to run
CMD ["./main"]