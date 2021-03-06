from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher

import json
import requests

with open('./customer_feedback_config.json') as f:
    cfg = json.load(f)


class ValidateFeedbackForm(FormValidationAction):
    def name(self) -> Text:
        return 'validate_feedback_form'

    @staticmethod
    def api_credentials():
        return {
            'url': cfg['url'],
            'sentiment_analysis': cfg['sentiment_analysis'],
            'has_summary': cfg['has_summary']
        }

    def validate_feedback(
        self,
        slot_value: Text,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:

        r = requests.post(self.api_credentials()['url'], json={'sentence': slot_value})
        sentiment = r.text.strip('"')

        if sentiment == 'pos':
            print('postive feedback')
            dispatcher.utter_message(text='We are glad to hear that.')
            return {'feedback': slot_value}
        elif sentiment == 'neu':
            print('neutral feedback')
            dispatcher.utter_message(text='Thank you for your valuable feedback.')
            return {'feedback': slot_value}
        elif sentiment == 'neg':
            print('negative feedback')
            dispatcher.utter_message(text='We are sorry to hear that. We aim to do better next time.')
            return {'feedback': slot_value}
        else:
            print('invalid feedback')
            dispatcher.utter_message(text='an error has occured, feedback not recorded.')
            return {'feedback': None}
