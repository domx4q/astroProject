git fetch --all
git checkout --force testing
git reset --hard origin/testing
git pull origin testing
npm ci
npm run build
./startServer.sh
