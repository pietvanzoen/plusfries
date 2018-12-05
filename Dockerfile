FROM node:alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

ENV NODE_ENV production
RUN npm install

COPY . .

ENV USER plusfries
RUN adduser -S ${USER}
RUN chown -R ${USER} /app
USER ${USER}

ENV PORT 8080
CMD ["npm", "start"]
