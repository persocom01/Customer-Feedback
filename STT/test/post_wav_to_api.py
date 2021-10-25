# This file sends a post request with a test_wav file to an api for testing.
from requests_toolbelt import MultipartEncoder
import os

filepath = './Python/test/test_wav.wav'
domain = 'http://localhost:8000'
path = f'{domain}/'


def send_request(path, post=False, **kwargs):
    import requests
    if post:
        try:
            request = requests.post(path, **kwargs)
        except requests.exceptions.ConnectionError as e:
            print('http(s) request failed, perhaps try the other...')
            raise e
    else:
        try:
            request = requests.get(path, **kwargs)
        except requests.exceptions.ConnectionError as e:
            print('http(s) request failed, perhaps try the other...')
            raise e
    return request


with open(filepath, 'rb') as f:
    filename = os.path.basename(f.name)
    encoder = MultipartEncoder({'file': (filename, f)})
    r = send_request(path, post=True, data=encoder, headers={'Content-Type': encoder.content_type}, verify=False)

if r.status_code == 200:
    print(r.text.strip('"'))
else:
    print('request code: ' + str(r.status_code))
