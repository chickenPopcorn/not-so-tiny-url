
installation instruction for mac
first install node.js version 6 using `brew install node`
make sure npm is install properly and cd into src folder
and do `npm install` to install dependency.
Then run `brew install redis` and then `brew services start redis` to start cache service.
Using `node server.js` or `npm start`
to run the app.
The app listens on port `3000`.

Restful API
post request:
`localhost:3000/api/v1/urls`
```
{
	"longUrl": "https://www.google.com"
}
```
get request:
`localhost:3000/`

Docker Instruction
Make sure you ahve docker install on your machine, then go `src` folder and run
`docker-compose up` docker will automatic download required base docker images files
from docker hub, and then build 3 docker containers for app in `src/app` folder based on
`Dockerfile` , and run `redis` and `nginx` see the image below for illustration.

MongoDB
The MongoDB is setup on mLab.com using Amazon S3 service on US-EAST1.
It can be access by the command below
`mongodb://<dbuser>:<dbpassword>@ds049466.mlab.com:49466/tinyurl`
The nodeJS server uses `mongoose` library to access data on mLab.
