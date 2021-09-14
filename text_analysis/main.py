import json
from sqlalchemy import create_engine
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import vader
import textrank
import uvicorn

cfg_path = './server.cfg'

with open(cfg_path, 'r') as f:
    cfg = json.load(f)

try:
    password = cfg['password']
except KeyError:
    password = ''
engine_string = f"mysql+pymysql://{cfg['user']}:{password}@{cfg['host']}/{cfg['db']}"
engine = create_engine(engine_string, pool_pre_ping=True, pool_recycle=300)
con = engine.connect()

app = FastAPI()

origins = cfg['cors']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/')
async def get_sentiment(res: Request):
    data = await res.json()
    sentence = data['text']
    ss = vader.sentiment_scores(sentence)
    compound_score = ss['compound']
    topics = textrank.return_topics(sentence)
    command = f'INSERT INTO customer_feedback(feedback, sentiment_score, topics) VALUES ("{sentence}", {compound_score}, "{topics}");'
    con.execute(command)
    return vader.classify_sentiment(ss)


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, log_level='debug', ssl_keyfile='./key.pem', ssl_certfile='./cert.pem')
