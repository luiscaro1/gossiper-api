FROM node

COPY . /server

WORKDIR /server
ENV NODE_ENV "production"

RUN npm install

CMD ["node", "index.js", "--bind 0.0.0.0:$PORT"]
