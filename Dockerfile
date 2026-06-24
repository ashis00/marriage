FROM nginx:1.27-alpine

# Copy the static site into nginx's web root
COPY . /usr/share/nginx/html

# Remove files that should not be publicly served
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/default.conf.template

# nginx config template (Railway provides the port via $PORT at runtime)
COPY default.conf.template /etc/nginx/default.conf.template

# Substitute only $PORT (leaving nginx variables like $uri intact), then start
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
