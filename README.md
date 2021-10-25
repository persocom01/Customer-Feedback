# inp-customer-feedback

This repository is of an add-on to the existing chatbot model (ASR Singlish speech recognition model) that can help customer order food and track the real time sentiments of the customer reviews to keep track of their satisfaction with the service.

As an add on, it does not work by itself. However, for demo purposes, a complete, working system was constructed.

Features:
* Returns a sentiment score between -1 and 1 for a given text
* Able to return the main topic of a given text
* Changes response based on sentiment detected
* Saves feedback and analysis results to sql server
* Display results to business uses using a dashboard

Optional:
* Speech To Text (STT) was implemented after the fact after it was developed as a reusable asset at [vosk-speech-to-text-api](https://github.dxc.com/Digital-Innovation-Lab-Asset/vosk-speech-to-text-api) in a different project.

## Installation

There are 6 parts to this system, but only the first 4 are included in this repository:
1. IVRS
2. chatbot api
3. chatbot action server
4. FastAPI api server
5. Database server - the database for this system is mariadb and is found on `localhost:3306`. One easy way to get it installed on windows is using installing  the [WinNMP](https://winnmp.wtriple.com/) server stack. mysql servers will work equally well.
6. Docker metabase server - how this is installed will be explained later.
7. Speech to text server (optional)

1. Clone the repository to your local computer

Using git bash, enter:

```
git clone git@github.dxc.com:ctoh8/inp-customer-feedback.git
```

2. Install dependencies if not already present

### Database setup

This system inserts data into a table with 4 columns:
1. timestamp
2. feedback
3. sentiment_score
4. topics

The table can be created with the following sql command:

```
CREATE TABLE customer_feedback(
    timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP
    feedback VARCHAR(255),
    sentiment_score FLOAT,
    topics VARCHAR(255),
    PRIMARY KEY(timestamp)
);
```

### Metabase setup

Metabase was set up using docker. Once docker is installed, enter the following into command line:

```
docker pull metabase/metabase
docker run -d -p 3001:3000 --name metabase metabase/metabase
```

This sets up a docker image of Metabase on port `3001`, where it can be reached using a web browser. From the browser, Metabase can be configured to accept a database as a data source. In this case, `localhost` was used. However, because localhost cannot be reached within a docker image, `host.docker.internal` or `172.17.0.1` should be used instead for windows and linux respectively.

## Deployment

There are 6 parts to this system:
1. IVRS - Inside the `IVRS` folder, enter `npm start`.
2. chatbot api - Inside the `chatbot` folder, enter `rasa run --enable-api --cors "*"`
3. chatbot action server - inside the `chatbot` folder, enter `rasa run actions`
4. FastAPI api server - inside the `text_analysis` folder, enter `uvicorn main:app --reload`
5. Database server - the database for the windows installation is mariadb and is found on `localhost:3306` that is run using the WinNMP stack manager.
6. Docker metabase server - Once installed, run the server using the docker dashboard.
7. Speech to text server (optional) - inside the `STT` folder, enter `python main.py`

Reach the IVRS app at localhost:3000 and metabase at localhost:3001.

A .bat file was made for windows systems to run all the above at once, but must be modified for individual computers.

Once all systems are running, navigate to `https://localhost:3000` to speak to IVRS and `https://localhost:3001` to reach metabase.

A simple dialog with IVRS is as follows:

```
IVRS: Hey! How are you?

user: order food

IVRS: What will be your order?

user: hawaiian pizza

IVRS: Thank you for your order!

IVRS: Would you like to provide us with feedback?

user: yes

IVRS: What did you think about our service?

user: nobody puts pineapple on pizza

IVRS: Thank you for your valuable feedback.

IVRS: Thank you for using our service. We hope to see you again!
```

## Credits

* Dataset - [kaggle](https://www.kaggle.com/snap/amazon-fine-food-reviews)

## Future improvements

* The machine learning implementation of sentiment analysis in this project needs to be improved before it is made a reusable asset. Use of logistic regression and transformers are suggested avenues for experimentation.
* In addition, more configuration options, such as making the database optional, and allowing other commonly used databases are planned to be added.
* The sentiment analysis api needs to be rewritten to be more modular.
* Documentation for configuration and dependencies.

## Contributing

Please reach out to Digital Innovation Lab (SG).

## Authors

Clarence Toh - *baseline*

## License

The copyright of this project belongs to DXC and Digital Innovation Lab (SG). All rights reserved.
