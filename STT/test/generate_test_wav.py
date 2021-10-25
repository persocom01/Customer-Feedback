# This file uses the microphone to generate a wav file.
import speech_recognition as sr
import pyaudio

file = './test_wav.wav'


def get_microphone_device_index():
    device_index = -1
    pa = pyaudio.PyAudio()
    device_index = pa.get_host_api_info_by_index(0)['defaultInputDevice']
    if device_index == -1:
        raise Exception('no microphone found')
    else:
        return device_index


mic = sr.Microphone(device_index=get_microphone_device_index())

r = sr.Recognizer()

with mic as source:
    print('recording')
    audio = r.listen(source)
    with open(file, 'wb') as f:
        f.write(audio.get_wav_data())

# Built in speech recognition not recommended for deployment use.
# print(r.recognize_google(audio))
