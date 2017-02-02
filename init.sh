#!bin/bash
docker exec -it interact-mongo mongo
user interact
db.user.insert({ name: 'localhost', uid: 'IC9-55938-5' })
exit