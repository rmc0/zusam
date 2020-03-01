#!/bin/sh

set -xe

# Remove event directories that can cause fails like:
# s6-supervise <service name>: fatal: unable to mkfifodir event: Permission denied
rm -rf $(find /etc/s6.d -name 'event')

crontab -r
echo "* * * * * /zusam/api/bin/console zusam:cron > /dev/stdout" | crontab -

DATABASE_URL="sqlite:///%kernel.project_dir%/../data/${DATABASE_NAME}"

sed -i -e "s|<SECRET>|$(openssl rand -base64 48)|g" \
       -e "s|<DOMAIN>|${DOMAIN}|g" \
       -e "s|<DATABASE_URL>|${DATABASE_URL}|g" \
       -e "s|<ENV>|${ENV}|g" \
       -e "s|<LANG>|${LANG}|g" \
       /zusam/config

sed -i -e "s|content=\"en\"|content=\"${LANG}\"|g" \
       /zusam/public/index.html

if ! [ -f /zusam/data/config ]; then
    cp /zusam/config /zusam/data/config
fi

if ! [ -L /zusam/public/files ]; then
    ln -s /zusam/data/files /zusam/public/files
fi

# initialize database if none is present
if ! [ -f "/zusam/data/${DATABASE_NAME}" ]; then
    /zusam/api/bin/console zusam:init "${INIT_USER}" "${INIT_GROUP}" "${INIT_PASSWORD}"
fi

exec /bin/s6-svscan /etc/s6.d
