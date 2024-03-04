git fetch --all
git checkout --force master
git reset --hard origin/master
git pull origin master
npm ci
npm run build
./startServer.sh
