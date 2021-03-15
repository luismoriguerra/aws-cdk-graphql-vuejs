
echo 'Installing backend '
cd backend
yarn install --frozen-lockfile
yarn build


echo 'Installing Frontend '
cd ../fronten
yarn install --frozen-lockfile
yarn build

echo 'Deploying Infraestructure'
cd ../cdk
yarn install --frozen-lockfile
cdk diff
cdk deploy --verbose --debug --require-approval never
