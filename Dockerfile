FROM node:alpine
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./babel.config.json ./
COPY ./jest.config.cjs ./
RUN npm install
COPY ./src ./src
COPY ./.env ./
COPY ./config.js ./
CMD ["npm", "start"]