#!/bin/bash

ENV=production

kubectl --namespace $ENV replace -f ./components/redis-master.yml
kubectl --namespace $ENV apply -f ./components/redis-master.yml

kubectl --namespace $ENV replace -f ./components/redis-slave.yml
kubectl --namespace $ENV apply -f ./components/redis-slave.yml