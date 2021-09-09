# Customer-Feedback

## Installation

### Metabase setup

Metabase was set up using docker. Once docker is installed, enter the following into command line:

```
docker pull metabase/metabase
docker run -d -p 3001:3000 --name metabase metabase/metabase
```

This sets up a docker image of Metabase on port `3001`, where it can be reached using a web browser. From the browser, Metabase can be configured to accept a database as a data source. In this case, `localhost` was used. However, because localhost cannot be reached within a docker image, `host.docker.internal` or `172.17.0.1` should be used instead for windows and linux respectively.

## Usage

There are parts to this system:
1. IVRS - Inside the `IVRS` folder, enter `npm run`.
2. chatbot api - Inside the `chatbot` folder, enter `rasa run --enable-api --cors "*"`
3. chatbot action server - inside the `chatbot` folder, enter `rasa run actions`
4. FastAPI api server - inside the `sentiment_analysis` folder, enter `uvicorn main:app --reload`
5. Database server - the database for the windows installation is mariadb and is found on `localhost:3306` that is run using the WinNMP stack manager.
6. Docker metabase server - Once installed, run the server using the docker dashboard.

## Credits

* Dataset - [kaggle](https://www.kaggle.com/snap/amazon-fine-food-reviews)
