FROM node:20.11.0-alpine AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json  ./
RUN npm i --ignore-scripts

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json ./
RUN NODE_ENV=production npm i --ignore-scripts --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace install:addon:deps
RUN npm run build

# Production stage
FROM base
ARG APP_RELEASE
ENV APP_RELEASE=${APP_RELEASE}
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
