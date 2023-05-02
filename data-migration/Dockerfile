FROM python:3.9-slim-buster

WORKDIR /scripts

RUN apt-get update && \
    apt-get install -y openjdk-11-jdk-headless scala libgomp1 libblas3

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
COPY . /scripts

CMD ["python", "app.py"]
