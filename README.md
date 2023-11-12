# CI/CD how it works

## Branch to envinroment 

  * develop &#8594; dev envinroment
  * stage &#8594; stage envinroment
  * master &#8594; prod envinroment

Jenkins trigger every 10 min for for new commits into Git develop branch and stage branch. If found some new commits into branch, starting job for build and deploy the code.

Master deployed only after merged by manager into master branch and uploaded a secret file to jenkins if it need.

## Secret File (usually it a .txt file) witch contain a envinroment variables, passwords, urls, etc.
### Steps to upload an secret file:
1. Login into Jenkins WEB panel.

2. From start pag go to &#8594; "Manage Jenkins" &#8594; "Manage Credentials" &#8594; "Global credentials" &#8594; "Add Credentials"

   - For update present secret file select &#8594; "ENV_FILE" &#8594; "Update" and select checkbox "Replace", then upload a new file.

3. For create new secret file select next:

   - "Kind" &#8594; (Secret file)

   - "Scope" &#8594; (Global)

   - "File" &#8594; Choose needed .txt or other text format file from local pc

   - "ID" &#8594; ENV_FILE

   - "Description" &#8594; may leave blank (but better to type something)
#### Branching model
- master¬  (main branch, merge to master allowed only for maintainers)
    - stage¬ (Intermediate branch for demonstration, merge allowed for everyone, after mainteiner aprove)
        - develop (develop branch for testing, merge alloved for everyone who has developer or mainteiner role)

**Merge process:**
  1. If develop branch worked an tested, then can be merged to stage.
  2. If stage branch code working and tested, then can be merged to production branch by manager who respons for it.

### Dev envinroment URL's

https://jenkins.fin-dev.abtollc.com/ - WEB panel Jenkins

https://fin-dev.abtollc.com/ - Frontend

https://api.fin-dev.abtollc.com/ - Backend


    

**Docker debug commands:** 

    show all runned containers:     docker ps
        keys:
            show all containers     -a

    see log of docker container:    docker logs [OPTIONS] CONTAINER
        keys:
            --details		        Show extra details provided to logs
            --follow , -f		    Follow log output

    manually building the containers:    docker build -t $image_name .

    manually running the container:     docker run -d --env-file example.env -v path_to_the_resources:/opt/app/ --name $container_name --restart=always -p 127.0.0.1:8081:80 -d $image_name 

# Traffic
User request 
&#8594; 
Public proxy server(https://) 
&#8594; 
Private proxy server(https://) 
&#8594; 
Local docker container(port) 








## Developer debug

``#==========================================================

#localhost (debug) docker image build commands


#Build container
docker build -t onlinefinances/frontend .


#Run on 8080 port onlinefinances/frontend
docker run -d -p 8080:80 onlinefinances/frontend

http://localhost:8080/

#==========================================================

Current bundle max sizes:
{
  "type": "initial",
  "maximumWarning": "1mb",
  "maximumError": "2mb"
},
{
  "type": "anyComponentStyle",
  "maximumWarning": "4kb",
  "maximumError": "8kb"
}

#==========================================================

