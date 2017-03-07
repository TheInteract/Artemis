docker exec -it interact-mongo mongo
use interact
db.createCollection("product")
db.createCollection("user")
db.createCollection("feature")
db.createCollection("version")
db.product.insert({ "API_KEY_PRIVATE": "IC9-55938-5", "API_KEY_PUBLIC": "12345", "ip": "158.108.136.125", "domainName": "localhost:9999" })
exit
