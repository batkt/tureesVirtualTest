docker build --platform=linux/amd64 -t batuk0227/turees-web .

docker push batuk0227/turees-web:latest

docker save tureesfront:latest | gzip > ./docker/tureesfront_front.tar.gz
