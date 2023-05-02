FROM python:3.9-slim-buster

WORKDIR /app
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk-headless scala libgomp1 libblas3

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app

CMD ["python", "app.py"]
