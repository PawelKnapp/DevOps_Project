FROM nginx:alpine

ARG API_URL=/api/todos

RUN rm -rf /usr/share/nginx/html/*

COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

RUN sed -i "s|__API_URL__|${API_URL}|g" /usr/share/nginx/html/app.js

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
