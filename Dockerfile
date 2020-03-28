FROM node:12.16.1-alpine as client-builder
WORKDIR /usr/src/app
COPY ./client/package.json .
RUN yarn install
COPY ./client .
RUN yarn build

FROM node:12.16.1-alpine as server-builder
WORKDIR /usr/src/app
COPY ./server/package.json .
RUN yarn install
COPY ./server .
RUN yarn build

FROM node:12.16.1-alpine
WORKDIR /usr/src/app
COPY --from=server-builder /usr/src/app .
COPY --from=client-builder /usr/src/app/build ./public
EXPOSE 4000
ENV NODE_ENV production
USER node
CMD ["yarn", "start"]
