docker build -t tureesfront .
docker save tureesfront:latest | gzip > tureesfront_front.tar.gz
