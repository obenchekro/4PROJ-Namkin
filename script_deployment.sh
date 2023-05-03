#!/bin/bash

declare -a DOCKER_IMAGE_NAMES=("<docker-image-name-1>" "<docker-image-name-2>" "<docker-image-name-3>")

if ! command -v docker &> /dev/null
then
    echo -e "\e[31m Error: Docker is not installed or running. Please install Docker and start it before continuing. \e[0m"
    exit
fi

if ! command -v docker-compose &> /dev/null
then
    echo -e "\e[31m Error: Docker Compose is not installed. Please install Docker Compose before continuing. \e[0m"
    exit
fi

if [ $(docker-compose ps -q) ]; then
    echo -e "\e[32m The Docker Compose is already running. \e[0m"
else
    if [ ! -f docker-compose.yml ]; then
        echo -e "\e[31m Error: the docker-compose.yml file cannot be found. Please make sure the file exists in the current directory. \e[0m"
        exit
    fi
    
    for DOCKER_IMAGE_NAME in "${DOCKER_IMAGE_NAMES[@]}"
    do
        if [ $(docker images -q $DOCKER_IMAGE_NAME) ]; then
            echo -e "\e[33m The Docker image $DOCKER_IMAGE_NAME has already been built. \e[0m"
            exit
        else
            if [ $(docker ps -q -f ancestor=$DOCKER_IMAGE_NAME) ]; then
                echo -e "\e[33m A Docker container is already running for the image $DOCKER_IMAGE_NAME. \e[0m"
                exit
            fi
        fi
    done
    
    docker-compose up -d
    echo -e "\e[32m The Docker Compose has been successfully launched for the specified Docker images. \e[0m"
fi