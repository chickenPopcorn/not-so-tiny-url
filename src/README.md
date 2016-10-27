### Installation Instruction for Mac

- Install node.js version 6 using `brew install node`.
- Make sure npm is install properly and cd into src folder.
- Do `npm install` to install dependency.
- Run `brew install redis` and then `brew services start redis` to start cache service.
- Type `node server.js` or `npm start` to run the app.
- The app listens on port `3000`.

### Restful API
- POST requests:
```
Base URL: localhost:3000/api/v1/urls
POST body:
{
	"longUrl": "https://www.google.com"
}
```
- GET request:
```
Base URL: localhost:3000/
```

### Docker Instruction
- Make sure you have docker installed on your machine.
- cd to `src` folder and run `docker-compose up`.
- Docker will automatic download required base docker images files from docker hub.
- Build 3 docker containers for app in `src/app` folder based on `Dockerfile` and run `redis` and `nginx`.

### MongoDB
- The MongoDB is setup on mLab.com using Amazon S3 service on US-EAST1.
- It can be accessed by the command 
`mongodb://<dbuser>:<dbpassword>@ds049466.mlab.com:49466/tinyurl`
- The nodeJS server uses `mongoose` library to access data on mLab.
