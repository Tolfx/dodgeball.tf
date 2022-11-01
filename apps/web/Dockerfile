# BUILDER
FROM node:16-alpine as BUILDER

# Caching
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN apk update && \
  apk upgrade && \
  apk add git

RUN npm install -g @types/node \
  && npm install -g typescript@4.3.5 

RUN npm i -g turbo

COPY . .

RUN npm i
RUN npm install -w=@dodgeball/api --force
RUN npm run build -w=packages
RUN npm run build -w=@dodgeball/api

##########################

##########################

# APP
FROM node:16-alpine as APP

ENV NODE_ENV=production
COPY --from=BUILDER /app/ .

WORKDIR /app/apps/web

COPY --from=BUILDER /app/apps/web/ .

RUN apk update && \
  apk upgrade && \
  apk add git

ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk add --no-cache --upgrade bash

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/apps/web/.next

USER nextjs

EXPOSE 3000
ENV PORT 3000

RUN npx next telemetry disable

CMD npm run start