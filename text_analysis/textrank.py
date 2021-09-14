import spacy
import pytextrank


def return_topics(text):
    nlp = spacy.load('en_core_web_sm')
    nlp.add_pipe('textrank')
    doc = nlp(text)
    output = []
    for phrase in doc._.phrases:
        topic = phrase.text
        topic = topic.lower().replace('the ', '')
        output.append(topic)
    return ', '.join(output)
