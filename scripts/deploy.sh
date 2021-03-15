
echo 'Installing backend '
cd backend
yarn install --frozen-lockfile
yarn build

echo 'Deploying Infraestructure'
cd ..
cd cdk
yarn install --frozen-lockfile
cdk diff
cdk deploy  --debug --require-approval never
