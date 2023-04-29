#!/bin/bash

# Array of Docker image names used in the Docker Compose
declare -a DOCKER_IMAGE_NAMES=("<docker-image-name-1>" "<docker-image-name-2>" "<docker-image-name-3>")

# Check if Docker is installed and running
if ! command -v docker &> /dev/null
then
    echo "Error: Docker is not installed or running. Please install Docker and start it before continuing."
    exit
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Error: Docker Compose is not installed. Please install Docker Compose before continuing."
    exit
fi

# Check if any of the Docker containers are already running for the specified images
for DOCKER_IMAGE_NAME in "${DOCKER_IMAGE_NAMES[@]}"
do
    if [ $(docker ps -q -f ancestor=$DOCKER_IMAGE_NAME) ]; then
        echo "A Docker container is already running for the image $DOCKER_IMAGE_NAME."
        exit
    fi
done

# Check if the Docker Compose is already running
if [ $(docker-compose ps -q) ]; then
    echo "The Docker Compose is already running."
else
    # Check if the docker-compose.yml file exists
    if [ ! -f docker-compose.yml ]; then
        echo "Error: the docker-compose.yml file cannot be found. Please make sure the file exists in the current directory."
        exit
    fi
    
    # Check if the Docker images have already been built
    for DOCKER_IMAGE_NAME in "${DOCKER_IMAGE_NAMES[@]}"
    do
        if [ $(docker images -q $DOCKER_IMAGE_NAME) ]; then
            echo "The Docker image $DOCKER_IMAGE_NAME has already been built."
        else
            # Check if Dockerfile exists in the same directory as the docker-compose.yml file
            DOCKERFILE_PATH=$(dirname "/home/user/projects/myapp")"/$DOCKER_IMAGE_NAME"
            if [ ! -f "$DOCKERFILE_PATH/Dockerfile" ]; then
                echo "Error: the Dockerfile for $DOCKER_IMAGE_NAME cannot be found in $DOCKERFILE_PATH. Please make sure the file exists."
                exit
            fi

            # Build the Docker image in the directory where the Dockerfile is located
            docker build -t $DOCKER_IMAGE_NAME $DOCKERFILE_PATH
        fi
    done
    
    # Start the Docker Compose
    docker-compose up -d
    echo "The Docker Compose has been successfully launched for the specified Docker images."
fi