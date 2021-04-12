FROM node

COPY . /server

WORKDIR /server

RUN npm install

CMD ["node", "index.js", "--bind 0.0.0.0:$PORT"]
