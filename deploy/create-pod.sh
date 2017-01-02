#!/bin/bash

kubectl create -f ./kube-system/traefik.yml

ENV=production

kubectl create namespace $ENV

kubectl create --namespace $ENV -f ./components/collector.yml
kubectl create --namespace $ENV -f ./components/redis-master.yml
kubectl create --namespace $ENV -f ./components/redis-slave.yml
