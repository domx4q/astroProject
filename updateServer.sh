git fetch --all
git reset --hard origin/test_update
npm i
npm run build
./startServer.sh
