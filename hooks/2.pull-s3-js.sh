#!/bin/bash
set -e

#1. Copy js file to folder_release | If exist -> replace (in-place EC2); else insert (new EC2)
release_date=$(date +%Y%m%d)"_"$(date +%H%M%S)

if grep -F "release_folder" /home/$USER/.profile
then
    export release_folder=$release_date
    sed -i "/release_folder/c\export release_folder=$release_date" /home/$USER/.profile
else
    export release_folder=$release_date
    echo "export release_folder=$release_date" >> /home/$USER/.profile
fi

#2. Copy js file from s3 to EC2
cd /tmp
aws s3 cp s3://assetdata-frontend-content-stag/js.tar.gz .

#3. Unzip
tar -xvzf js.tar.gz

#4. Move folder new code to release_folder
mv /tmp/build/ /home/$USER/assetdata-fe/releases/$release_folder

echo "AfterInstall"