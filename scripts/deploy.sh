
echo 'Installing backend '
cd backend
yarn install --frozen-lockfile
yarn build

cd ..
cd cdk

echo 'Deploying Infraestructure'

cdk diff
cdk deploy  --debug --require-approval never
