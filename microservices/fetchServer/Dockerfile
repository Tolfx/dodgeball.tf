# BUILDER
FROM node:16-alpine as BUILDER

# Caching
RUN apk add --no-cache libc6-compat

WORKDIR /microservices

RUN apk update && \
  apk upgrade && \
  apk add git

RUN npm install -g @types/node \
  && npm install -g typescript@4.3.5 

RUN npm i -g turbo

COPY . .

RUN npm install -w=@dodgeball/fetchserver --force

RUN npm run build -w=packages

RUN npm run build -w=@dodgeball/fetchserver

##########################

# APP
FROM node:16-alpine as APP

ENV NODE_ENV=production

COPY --from=BUILDER /microservices/ .

WORKDIR /microservices/fetchServer

COPY --from=BUILDER /microservices/fetchServer/ .

RUN apk update && \
  apk upgrade && \
  apk add git

ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

CMD [ "node", "./dist/index.js" ]