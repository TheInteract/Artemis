FROM node:6.9.2-slim
MAINTAINER ChinCluBi <chinnaporn.s@ku.th>
COPY /src /app/src
COPY /static /app/static
COPY /node_modules /app/node_modules
COPY /config /app/config
COPY /index.js /app/index.js
COPY /.babelrc /app/.babelrc
COPY /package.json /app/package.json
WORKDIR /app
EXPOSE 80
ENTRYPOINT ["npm", "run", "start"]
