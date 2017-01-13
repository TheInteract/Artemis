#!bin/bash

ENV=production

kubectl --namespace $ENV patch deployment collector-server \
    -p'{"spec":{"template":{"spec":{"containers":[{"name":"collector-server","image":"chinclubi/collector:latest"}]}}}}'