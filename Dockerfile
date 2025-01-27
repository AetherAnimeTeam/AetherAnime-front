FROM node:18-slim

WORKDIR /aetheranime_front

COPY . /aetheranime_front

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npx", "http-server", "build", "-p", "3000"]
