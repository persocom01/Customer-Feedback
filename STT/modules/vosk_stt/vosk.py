from vosk import Model, KaldiRecognizer, SetLogLevel
import os
import wave
import json


class Vosk:
    def __init__(self, modelpath):
        SetLogLevel(0)
        self.model = modelpath

    @property
    def model(self):
        if hasattr(self, '_model'):
            return self._model
        else:
            print('[vosk_stt]the model has not been set')

    @model.setter
    def model(self, value):
        if os.path.exists(value):
            self._model = Model(value)
        else:
            print("[vosk_stt]model not found. Please download the model from https://alphacephei.com/vosk/models and unpack as 'model' in the current folder.")

    def text_from_sound_file(self, file):
        wf = wave.open(file, 'rb')
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != 'NONE':
            print('[vosk_stt]audio file must be WAV format mono PCM.')
            exit(1)

        rec = KaldiRecognizer(self._model, wf.getframerate())
        rec.SetWords(True)

        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            rec.AcceptWaveform(data)
            # if rec.AcceptWaveform(data):
            #     print(rec.Result())
            # else:
            #     print(rec.PartialResult())

        return json.loads(rec.FinalResult())['text']
