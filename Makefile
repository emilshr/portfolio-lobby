database:
	docker-compose up -d database

backend:
	docker-compose up -d backend
	
dev: 
	docker-compose up -d database
	docker-compose up -d backend

destroy:
	docker-compose down -v