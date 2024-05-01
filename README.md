#Spina GPT

This project is the classic chat with an AI, which allows uploading pdfs, urls and text files, to train. 
The front end is done with vite.js and the backend with nestjs and fastify.

It's not made in python, but in JavaScript.

## Run locally: 

start the embedding database

```
docker compose up
```

see compose.yml

### front-end

```
cd frontend
yarn dev
```


### server 

copy `.env` to `.env.template` and add this info:

```
OPENAI_API_KEY=<your-openai-key>
QDRANT_URL=http://localhost:6333
QDRANT_CLUSTER_NAME=whatever
```

```
yarn start:dev
```
