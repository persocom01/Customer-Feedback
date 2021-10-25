# vosk-speech-to-text-api-python

Covert speech to text using the vosk api without relying on 3rd party services.

It is fast, lightweight, and works out of the box with minimal setup and configuration.

## Pre-requisites

This app requires at least `python 3.5` to be installed:

* [python 3.5](https://www.python.org/downloads/)

The python modules for the api are listed in `requirements.txt`. They are:
* `fastapi` - modern, fast (high-performance), web framework for building APIs.
* `python-multipart` - needed by FastAPI to handle form data.
* `uvicorn` - an ASGI server, which is needed to run a FastAPI app.
* `vosk` - the speech recognition toolkit used to covert speech to text (STT).

In addition, for testing purposes, the following python modules were used:

* `requests-toolbelt` - provides support to uploading large multipart files without first loading the file into ram.
* `SpeechRecognition` - the api used to convert voice into a wav file.
* `pyaudio` - needed for microphone support.

## Installation

1. Clone the repository to your local computer

Using git bash, enter:

```
git clone git@github.dxc.com:Digital-Innovation-Lab-Asset/vosk-speech-to-text-api.git
```

2. Install dependencies if not already present

The requirements for the app are in `requirements.txt` in this folder. To install, enter:

```
pip install -r requirements.txt
```

## Future improvements

Add streaming functionality to the api.

## Tests

The functionality of the api can be tested at any time by running them the running the test files in the `test` folder while the api is running.

* `generate_test_wav.py` - allows you to record your own voice through a microphone and convert it to a wav file.
* `post_wav_to_api.py` - posts the wave file to the api for processing and prints the text result.

A sample `test_wav.wav` has already been included in the test folder. The test files obtained the following result:

| No. | Test Cases | Results |
| ------ | ------ | ------ |
| 1 | http test_wav.wav | <ul><li>the law is my life and my salvation</li><li>Time taken: 2.303s</li></ul> |
| 2 | https test_wav.wav | <ul><li>the law is my life and my salvation</li><li>Time taken: 2.329s</li></ul> |

## Usage

### Configuration

The configuration files are located in `config.json` inside the `config` folder. Any keys needed for https should also be placed there. The configuration file contains 5 keys:

1. `cors` - the Cross-Origin Resource Sharing (CORS) domains that the app allows.
2. `https` - contains 3 subkeys that relate to the api's https functionality.
  - `enabled` - Set to `true` to enable https.
  - `certfile` - the location of the ssl certfile.
  - `keyfile` - the location of the ssl keyfile.
3. `model` - the path to the model folder.
4. `path` - the path part of the url needed to reach the api. For example: `http://example-domain.com<path>`.
5. `port` - the port the app runs on.

In addition, other speech to text models for can be downloaded from https://alphacephei.com/vosk/models

The model used in this app is `vosk-model-small-en-us-0.15`

### Deployment

The api is started by running the `main.py` file in this folder. In command line enter:

```
python main.py
```

### Inputs and Outputs

The app accepts a `.wav` file on port `8000` when run (configurable). The app is wave sample rate agnostic. The app will return a text response of the audio file converted to text. For more details on how to send a `.wav` file to the app, look in the `test` folder.

## Known issues

While not necessary for the app itself, the test files use the `pyaudio` module, which as of 4 Oct 2021 only works up to python 3.6 or using anaconda install.

## Credits

vosk uses pretrained models from https://alphacephei.com/vosk/models

The rights to these models belong to their respective owners.

## Contributing

Please reach out to Digital Innovation Lab (SG).

## Authors

Clarence Toh - *baseline*

## License

The copyright of this project belongs to DXC and Digital Innovation Lab (SG). All rights reserved.
