FROM mongo:4

# Copy the custom entrypoint script
COPY mongodb-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/mongodb-entrypoint.sh

ENTRYPOINT ["mongodb-entrypoint.sh"]
