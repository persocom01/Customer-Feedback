from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher

import requests


class ValidateFeedbackForm(FormValidationAction):
    def name(self) -> Text:
        return 'validate_feedback_form'

    @staticmethod
    def api_credentials():
        return {
            'url': 'http://localhost:8000/'
        }

    def validate_feedback(
        self,
        slot_value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:

        r = requests.post(self.api_credentials()['url'], json={'text': slot_value})
        sentiment = r.text.strip('"')
        print(sentiment)
        print('pos')
        print(sentiment == 'pos')

        if sentiment == 'pos':
            print('postive feedback')
            dispatcher.utter_message(text='We are glad to hear that')
            return {'feedback': slot_value}
        elif sentiment == 'neu':
            print('negative feedback')
            dispatcher.utter_message(text='Thank you for your valuable feedback')
            return {'feedback': slot_value}
        elif sentiment == 'neg':
            print('negative feedback')
            dispatcher.utter_message(text='We are sorry to hear that, and we aim to do better next time')
            return {'feedback': slot_value}
        else:
            print('invalid feedback')
            dispatcher.utter_message(text='an error has occured, feedback not recorded')
            return {'feedback': None}
