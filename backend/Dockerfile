FROM golang:1.23.4-alpine

WORKDIR /app

COPY . ./

RUN go mod download
RUN go mod verify
RUN go build

CMD ["./lobby"]

EXPOSE 8080