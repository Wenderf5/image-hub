set -e

echo "---------Starting Docker Containers---------"
echo ""
docker-compose up -d
sleep 10
echo ""

echo "---------Creating vHost---------"
echo ""
docker exec rabbitmq-development bash -c "rabbitmqctl start_app"
until docker exec rabbitmq-development bash -c "rabbitmqctl status >/dev/null 2>&1"; do
   echo "Waiting for RabbitMQ to start..."
   sleep 1
done
docker exec rabbitmq-development bash -c "rabbitmqctl add_vhost image_hub_vhost"
docker exec rabbitmq-development bash -c "rabbitmqctl set_permissions -p VHOST USER '.*' '.*' '.*'"
echo ""

echo "---------Creating queue---------"
echo ""
docker exec rabbitmq-development bash -c "rabbitmqadmin -u USER -p PASSWORD -V VHOST declare queue name=image-resize-queue durable=true"
echo ""

echo "---------Creating bucket---------"
echo ""
docker exec minio-development bash -c "mc alias set local URL USER PASSWORD"
docker exec minio-development bash -c "mc mb local/image-hub"
docker exec minio-development bash -c "mc anonymous set download local/image-hub"
echo ""

echo "---------Starting the backend---------"
echo ""
cd ./back-end && npm run start:dev
echo ""
