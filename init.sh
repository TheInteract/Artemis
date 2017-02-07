#!bin/bash
docker exec -it interact-mongo mongo
use interact
db.user.insert({ hostname: 'localhost', uid: 'IC9-55938-5' })
exit