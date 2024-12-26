#!/bin/bash
set -e

#1. Create structure folder if not exist
if [ ! -d "/home/$USER/assetdata-fe" ]; then
    mkdir /home/$USER/assetdata-fe
fi
if [ ! -d "/home/$USER/assetdata-fe/current" ]; then
    mkdir /home/$USER/assetdata-fe/current
fi
if [ ! -d "/home/$USER/assetdata-fe/releases" ]; then
    mkdir /home/$USER/assetdata-fe/releases
fi

echo "BeforeInstall"