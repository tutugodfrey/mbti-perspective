#! /bin/bash

MBTI_USER=DB_USER
MBTI_USER_PASS=DB_PASS
DB_NAME=mbtidb

export ADDRESS=$(wget -qO - http://ipecho.net/plain)
sudo apt update;
sudo apt install nginx -y;
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh;
sudo bash nodesource_setup.sh;
sudo apt install nodejs -y;
sudo apt install git -y;
git clone https://github.com/tutugodfrey/mbti-perspective;
cd mbti-perspective;
sudo sed -i s/localhost/${ADDRESS}/g  ./client/functs.js; # update the address to reach the backend server
npm install;
npm run build;
sudo cp public/{index.html,bundle.js} /var/www/html/;

sudo touch /mylog.txt;
sudo chmod 777 /mylog.txt;
# Provision data base
sudo apt install  postgresql-9.6 postgresql-client-9.6 -y;
sudo systemctl restart postgresql;
# echo postgres | sudo passwd --stdin postgres;
# sudo apt install postgresql-9.6 postgresql-contrib -y;
## sudo apt-get remove --purge postgresql-9.6 -y
# sudo systemctl enable --now postgresql
sudo useradd $MBTI_USER;
echo $MBTI_USER_PASS | sudo passwd --stdin $MBTI_USER;
# echo "local   mbtidb          mbti_user         md5" >> /etc/postgresql/9.6/main/pg_hba.conf;
sed -i "/# Database administrative login by Unix domain socket/ a local   $DB_NAME         $MBTI_USER        		md5" /etc/postgresql/9.6/main/pg_hba.conf;
sudo systemctl restart postgresql;

cat << END >> setup.sql
CREATE USER "$MBTI_USER" with PASSWORD '$MBTI_USER_PASS';
CREATE DATABASE $DB_NAME;
GRANT ALL ON DATABASE $DM_NAME to $MBTI_USER;
END

# sudo cp setup.sql /var/lib/postgresql;
# sudo chown postgres:postgres /var/lib/postgresql/setup.sql;
# sudo -i -u postgres 2> /mylog.txt;
# echo $PWD >> /mylog.txt
sudo -i -u postgres psql < setup.sql;
# psql -U postgres < /var/lib/postgresql/setup.sql 2>> /mylog.txt;

## if it be necessary for user to have active home dir
# sudo mkdir /home/mbti_user;
# sudo chown mbti_user:mbti_user /home/mbti_user;
# sudo -i -u mbti_user psql


# start the backend server
echo "DATABASE_URL=postgresql://$MBTI_USER:$MBTI_USER_PASS@localhost:5432/$DB_NAME" > .env
npm start;


