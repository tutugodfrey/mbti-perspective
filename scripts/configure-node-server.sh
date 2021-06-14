#! /bin/bash

yum update -y;
amazon-linux-extras install nginx1 -y;
# Install node.js
yum install -y gcc-c++ make;
curl -sL https://rpm.nodesource.com/setup_15.x | sudo -E bash -;
yum install nodejs -y;

# Attempt to get the address/host from environment
# else use the server Public IP address
# ADDRESS should the url of Load Balancer or backend server
# that accepts traffic from the frontend
if [[ -z $ADDRESS ]]; then
  export ADDRESS=$(wget -qO - http://ipecho.net/plain)
fi

npm install;
sed -i s/localhost:3005/${ADDRESS}/g  ./client/functs.js;
npm run build;
cp public/{index.html,bundle.js} /usr/share/nginx/html/;
cp -r public /usr/share/nginx/html/;
echo "DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}" | tee .env
npm start;
systemctl enable nginx;
systemctl start nginx;
