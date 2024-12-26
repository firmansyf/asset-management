#!/bin/bash
set -e

#1. Load env
source /home/$USER/.profile

KEEP_DEPLOYMENTS=2

#2. Symbolic link from folder_current to folder_release (zero downtime)
ln -s /home/$USER/assetdata-fe/releases/$release_folder /home/$USER/assetdata-fe/releases/current
mv /home/$USER/assetdata-fe/releases/current /home/$USER/assetdata-fe

#3. Remove old deploy
cd /home/$USER/assetdata-fe/releases
rm -rf $(ls /home/$USER/assetdata-fe/releases -t | grep -v $release_folder | tail -n +$((KEEP_DEPLOYMENTS+1)))

echo "🚀 Application deployed!"