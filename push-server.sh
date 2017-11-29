#!/usr/bin/env bash

# Please add below ref
#  git remote add server git@github.com:venturepact/og-build.git


BRANCH="admin-rely"
CONFIG_ENV=" --env=prod --prod --aot --build-optimizer --output-hashing none"

if [ "$1" = "admin" ]
then
    BRANCH="admin"
    CONFIG_ENV=" --prod --env=$1 --aot --build-optimizer --output-hashing none"
fi

node --max_old_space_size=7200 ./node_modules/.bin/ng build $CONFIG_ENV
#ng build $CONFIG_ENV --no-sourcemap

read -p "Are you sure you want to push these changes to $1 server?(y/n): " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff
    cd ../og-build
    git checkout . && git checkout $BRANCH
    git pull origin $BRANCH -Xours
    rm -rf *
    cp -r ../og-admin/dist/* .
    git add *
    now=$(date +"%m-%d-%Y at %H.%M.%S")
    git commit -am "$1  Build at $now"
    git push origin $BRANCH
    cd ../Outgrow-frontend
fi

