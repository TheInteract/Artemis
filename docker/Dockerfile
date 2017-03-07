FROM node:7-slim
MAINTAINER ChinCluBi <chinnaporn.s@ku.th>
COPY /server /app/server
COPY /node_modules /app/node_modules
WORKDIR /app/server
EXPOSE 80
ENTRYPOINT ["npm", "run", "start"]
