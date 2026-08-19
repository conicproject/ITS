docker compose -f docker-compose.scheduler.yml restart vehicle_scheduler
docker compose -f docker-compose.scheduler.yml restart record_scheduler
docker compose -f docker-compose.scheduler.yml restart blacklist_scheduler