### Deployment
After making changes to the repo, make sure run the following to deploy through AWS EC Container Service
```
docker build -t rxie25/tinyurl .
docker push rxie25/tinyurl

```
```
ecs-cli configure --region us-east-1 --cluster tinyurl

ecs-cli up --keypair SYNC --capability-iam --size 1 --instance-type t2.micro --force

ecs-cli compose --file aws-compose.yml up
```
for first time deployment using aws ec container service

and re-run AWS cloudformation stack

### Installation Instruction for Mac

- Install node.js version 6 using `brew install node`.
- Make sure npm has been installed properly and cd to the src folder.
- Do `npm install` to install all the dependencies.
- Run `brew install redis` if redis has not been installed.
- Run `brew services start redis` to start the cache service.
- Type `node server.js` or `npm start` to run the app.
- The app listens on port `3000`.

### Restful APIs
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

### Testing
Run the following command to start the testing.
```
npm test
```

### Local Code Coverage Report
This is to check the coverage of the test cases against the whole code base. Run the following command to get the report.
```
local codecoverage report
```

### Continuous Integration
We have integrated the testing and code coverage report into the Github repository. Every time we commit something, these two modules will be run automatically. One can find the results from the repo main page: https://github.com/chickenPopcorn/ASE-Group-Project.
