set base=C:/Users/ctoh8/Anaconda3/Scripts/activate.bat
start cmd /k "ECHO RASA API && call %base% && call conda activate rasa && cd chatbot && rasa run --enable-api --cors ""*"""
start cmd /k "ECHO RASA ACTION SERVER && call %base% && call conda activate rasa && cd chatbot && rasa run actions"
start cmd /k "ECHO IVRS && cd IVRS && npm start"
ECHO TEXT ANALYSIS
call %base%
cd text_analysis
uvicorn main:app --reload
PAUSE
