set -e

export $(grep -v '^#' .env | xargs)

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
docker exec rabbitmq-development bash -c "rabbitmqctl add_vhost $RABBITMQ_VHOST"
docker exec rabbitmq-development bash -c "rabbitmqctl set_permissions -p $RABBITMQ_VHOST $RABBITMQ_USER '.*' '.*' '.*'"
echo ""

echo "---------Creating queue---------"
echo ""
docker exec rabbitmq-development bash -c "rabbitmqadmin -u $RABBITMQ_USER -p $RABBITMQ_PASSWORD -V $RABBITMQ_VHOST declare queue name=$RABBITMQ_QUEUE durable=true"
echo ""

echo "---------Creating bucket---------"
echo ""
docker exec minio-development bash -c "mc alias set local $MINIO_URL $MINIO_USER $MINIO_PASSWORD"
docker exec minio-development bash -c "mc mb local/$MINIO_BUCKET"
docker exec minio-development bash -c "mc anonymous set download local/$MINIO_BUCKET"
echo ""

echo "---------Starting the backend---------"
echo ""
npm run start:dev
echo ""
