database:
	docker-compose up -d database

redis:
	docker-compose up -d redis

backend:
	docker-compose up -d backend
	
dev: 
	docker-compose up -d database
	docker-compose up -d redis
	docker-compose up -d backend

destroy:
	docker-compose down -v