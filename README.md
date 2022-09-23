docker build -t tureesfront .
docker save tureesfront:latest | gzip > ./docker/tureesfront_front.tar.gz
