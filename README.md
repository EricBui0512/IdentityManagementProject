# NextId Demo
NextId web  helps users to interact directly with NextIdNetwork in order to create/retreive user profile, create/update personal data.

## Live deployment
We deployed the Testnet version of the project at [http://demo.nextid.com/](http://demo.nextid.com/). 

## Project Structure
1. Server :  ExpressJs + MySQL in ./server folder
2. Front-end webapp: This webapp is using `Reactjs` and `Redux-sagas` and following their naming conventions. Source code of the webapp frontend is in `src`

## Install dependencies
The wallet is developed on `Nodejs`, we assume users have it installed in their environment. *We suggest to use Node v8.0.0*
```
npm install
```
to install depedencies in server side
```
cd ./server 
npm install
```

# Config hostname and ports
In order to run project in development mode:
- Set reactjs proxy in package.json: 
 "proxy": "http://localhost:4000/" 
 
- In folder src/services/constants.js
const REMOTE_API_HOST = 'http://localhost:4000'

- In folder server/config/app.json
 API_HOST_URL:'http://localhost:4000'

In order to run project in production mode:
- In folder src/services/constants.js
const REMOTE_API_HOST = 'http://<hostname>:<port>'

- In folder server/config/app.json
API_HOST_URL:'http://<hostname>:<port>'

If port is 80. Don't the URL should be 'http://hostname'

Before run in production mode.
type `npm start build` at root folder to do bundling javascripts, stylesheets.

After bundling the source code, go to ./server folder then type: `npm start` to run to do testing at port 4000. In production/live server please use PM2 to run this web application


## Run in development mode (rinkeby chain)
```
npm run dev
```
Once it is running, user can access to the web app by going to `http://localhost:3000`

To run the api in server side:
```
cd ./server
npm start
```
Once it is running, user can access to the api by going to `http://localhost:4000`

Please make sure that the react webapp has a proxy which point to `http://localhost:4000`

# Import Database structure
Please import initial-db.mysql in folder server/initial-db.sql to mysql server before run the server.

## Bundle webapp assets
```
npm run build
```