
FROM golang:1.22

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/reference/dockerfile/#copy
COPY . .

# Build
RUN  CGO_ENABLED=0 GOOS=linux go build cmd/main.go


EXPOSE 8080

# Run
CMD ["./main", "serve", "--http=0.0.0.0:8080"]
# CMD ["go", "run", "cmd/main.go", "serve", "--http=0.0.0.0:8080"]
# FROM alpine:latest

# # ARG PB_VERSION=0.22.4

# RUN apk add --no-cache \
#     unzip \
#     ca-certificates

# download and unzip PocketBase
# ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
# RUN unzip /tmp/pb.zip -d /pb/

# uncomment to copy the local pb_migrations dir into the image
# COPY ./pb_migrations /pb/pb_migrations

# # uncomment to copy the local pb_hooks dir into the image
# # COPY ./pb_hooks /pb/pb_hooks

# EXPOSE 8080

# # start PocketBase
# CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]