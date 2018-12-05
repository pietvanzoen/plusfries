FROM node:alpine
WORKDIR /app
COPY ./package.json ./package-lock.json ./

ENV NODE_ENV production
RUN npm install

COPY . .

RUN adduser -S plusfries
RUN chown -R plusfries /app
USER plusfries

CMD ["npm", "start"]
