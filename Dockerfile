# 安装依赖及打包
FROM node:12-alpine AS Builder

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

COPY . /app

RUN npm run build

# 配置 nginx 资源转发
FROM nginx:alpine

COPY --from=Builder app/dist/ /usr/share/nginx/html/

COPY --from=Builder \
 app/nginx.conf \
 /etc/nginx/conf.d/default.conf

EXPOSE 80


# 可直接配置 nginx, 在项目外部打包
