# FROM python:3.11.4
FROM ubuntu:22.04

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install python3.11 python3-pip -y

RUN apt-get install sqlite3 -y

WORKDIR /app

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

RUN sqlite3 database/imageDataAssetManagementTool.db < database/reset.sql;

EXPOSE 5000

CMD ["flask", "run", "--host", "0.0.0.0"]