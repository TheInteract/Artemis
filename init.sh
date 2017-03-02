#!bin/bash
docker exec -it interact-mongo mongo
use interact
db.createCollection("customer")
db.createCollection("user")
db.customer.insert({"API_KEY":"IC9-55938-5","hostname":"localhost","features":[{"name":"card-1","versions":[{"version":"A","percent":0},{"version":"B","percent":0}]},{"name":"card-2","versions":[{"version":"A","percent":0},{"version":"B","percent":0}]}]})
exit