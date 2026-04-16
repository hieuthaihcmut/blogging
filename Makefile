import-db:
	docker exec -i postgres_db psql -U root -d goblog < ./goblog.sql
	
export-db:
	docker exec -i postgres_db pg_dump -U root -d goblog > ./goblog.sql
server:
	go run .
start-container:
	docker compose up -d
stop-container:
	docker compose down