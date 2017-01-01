#!/bin/bash

ENV=production

kubectl create namespace $ENV

kubectl create --namespace $ENV -f ./components/redis-master.yml
kubectl create --namespace $ENV -f ./components/redis-slave.yml