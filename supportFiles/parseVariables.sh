#!/bin/bash

## JENKINS_VALUES_DOCKER_USERNAME=user

cat $1.env | egrep "^JENKINS_VALUES" | while read line
do
	variableName=$(echo $line | cut -d'_' -f3- | cut -d '=' -f1 | tr '[:lower:]' '[:upper:]')
        value=$(echo $line | cut -d'=' -f2- )
        echo "env.$variableName=\"$value\"" >> .env-name
done