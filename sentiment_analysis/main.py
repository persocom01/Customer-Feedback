from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import vader
import uvicorn

app = FastAPI()

origins = [
    '*'
]

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
    ss = vader.sentiment_scores(data['text'])
    return vader.classify_sentiment(ss)


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, log_level='debug')
