FROM node:16-alpine 

WORKDIR /src

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 2023

CMD ["npm", "run", "dev"]