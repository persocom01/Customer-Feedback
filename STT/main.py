import json
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pathlib
import uvicorn
import modules.vosk_stt.vosk as stt

config_path = './config/config.json'

try:
    with open(config_path, 'r') as f:
        config = json.load(f)
except Exception as e:
    print(f'[vosk_stt]error reading config file: {e}')

stt_model = config['model'] or './model'
cors = config['cors'] or ['*']
path = config['path'] or '/'
port = config['port'] or 8000
certfile = config['https']['certfile'] or './cert.pem'
keyfile = config['https']['keyfile'] or './key.pem'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
vosk = stt.Vosk(stt_model)


@app.post(path)
def post_audio(file: UploadFile = File(...)):
    with file.file as f:
        text = vosk.text_from_sound_file(f)
    print(f'[vosk_stt]speech to text: {text}')
    return text


app_name = pathlib.Path(__file__).stem
if __name__ == '__main__':
    if config['https']['enabled']:
        uvicorn.run(f'{app_name}:app', host='0.0.0.0', port=port, log_level='debug', ssl_certfile=f'{certfile}', ssl_keyfile=f'{keyfile}')
    else:
        uvicorn.run(f'{app_name}:app', port=port, reload=True)
