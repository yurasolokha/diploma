pipeline {
  environment {
	SECRET_FILE = credentials('ENV_FILE')
        IMAGE_NAME = sh (
                script: """#!/bin/bash +x       
                        echo $JOB_NAME | cut -d"/" -f2
                        """, returnStdout: true
                ).trim()
        ENV_NAME = sh (
                script: """#!/bin/bash +x       
                        echo $JOB_NAME | cut -d"/" -f1
                        """, returnStdout: true
                ).trim()
	PARSE = sh (
                script: """#!/bin/bash +x
			cp $SECRET_FILE ${ENV_NAME}.env       
                        ./supportFiles/parseVariables.sh ${ENV_NAME}
                        """, returnStdout: true
                ).trim()
}
agent any 
  stages {
	stage('Load Variables')
        {
            steps
            {
                script
                {
                        //load environment variables
                        load ".env-name"
			load "supportFiles/config_file.cfg"
                }
            }
        }
    stage('Building image') {
        steps{
        //sh 'printenv'
        dir('Client') {
    		script {
         		 docker.build("$IMAGE_NAME:${ENV_NAME}-${env.BUILD_ID}", "-f ${ENV_NAME}.Dockerfile .")
		       }
		}
      }
    }
stage('Push to registry') {
    steps {
        sh """#!/bin/bash +x
                        ###                   ###
                        ### Login to registry ###
                        ###                   ###
			pwd;\
                        docker login --username=${REGISTRY_LOGIN} --password=${REGISTRY_PASS} ${REGISTRY_ENV};\

                        ###  Push to repository  ###
			docker tag ${IMAGE_NAME}:${ENV_NAME}-${env.BUILD_ID} ${REGISTRY_ENV}/${IMAGE_NAME}:${ENV_NAME}-${env.BUILD_ID};\
                        docker push ${REGISTRY_ENV}/${IMAGE_NAME}:${ENV_NAME}-${env.BUILD_ID};\
			docker rmi -f ${IMAGE_NAME}:${ENV_NAME}-${env.BUILD_ID}
                """
    }
}
   stage('Running image') {
        steps{
		sh """#!/bin/bash +x
			cat ${ENV_NAME}.env | ssh ${SSH_CONNECTION_STRING} "cat | egrep -v '^JENKINS_VALUES'  > ${IMAGE_NAME}-${ENV_NAME}.env" 
                        ssh ${SSH_CONNECTION_STRING} "docker rm -f ${IMAGE_NAME}-${ENV_NAME} 2>1 >/dev/null || true ;\
                        docker login --username=${REGISTRY_LOGIN} --password=${REGISTRY_PASS} ${REGISTRY_ENV} ;\
                        docker run --env-file ${IMAGE_NAME}-${ENV_NAME}.env -v ${HOST_PATH}:${CONTAINER_PATH} --name ${IMAGE_NAME}-${ENV_NAME} --restart=always -p ${HOST_IP}:${FRONTEND_DOCKER_PORT}:${HOST_PORT} -d ${REGISTRY_ENV}/${IMAGE_NAME}:${ENV_NAME}-${env.BUILD_ID} ;\
                        cd ${WORKSPACE} && chmod 777 ${ENV_NAME}.env && rm -f ${ENV_NAME}.env"
                 
                """
    }
  }
}
post
    {
        always
        {
             // rm .env variables file
            sh "rm .env-name"
            sh "rm -f ${ENV_NAME}.env"
            //Workspace clean after build
            cleanWs()
            // make sure that the Docker image is removed
            sh "docker image prune -af  || true"
            script 
            {
                    emailext    subject: '$DEFAULT_SUBJECT',
                                body: '$DEFAULT_CONTENT',
                                replyTo: '$MAIL_TO',
                                to: '$MAIL_TO'
            }

        }
        failure 
        {
            script 
            {
                emailext    subject: '$DEFAULT_SUBJECT',
                            body: '$DEFAULT_CONTENT',
                            replyTo: '$MAIL_TO',
                            to: '$MAIL_TO'
            }
        }
    }
 }
