FROM node:22-alpine

RUN npm install -g pnpm@latest

WORKDIR /app

COPY ./packages ./packages

COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY ./package.json ./package.json
COPY ./turbo.json    ./turbo.json

COPY  ./apps/ws-backend  ./apps/ws-backend

RUN pnpm install
RUN pnpm run db:generate

RUN pnpm run build

EXPOSE 8080

CMD ["pnpm", "run" , "start:ws-backend"]