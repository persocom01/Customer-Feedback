from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import time
import uvicorn
import numpy as np

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
def audiorecog(file: UploadFile = File(...)):


    return 'success'


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, log_level='debug')
