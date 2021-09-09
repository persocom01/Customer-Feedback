import lupu
from nltk.corpus import stopwords


def return_topic(X):
    lup = lupu.Lupu()
    X = lup.text_list_cleaner(X, lup.contractions, r'[^a-zA-Z ]', str.lower, lup.lemmatize_sentence, ['wa', 'ha'])
    return X


doc1 = "Sugar is bad to consume. My sister likes to have sugar, but not my father."
doc2 = "My father spends a lot of time driving my sister around to dance practice."
doc3 = "Doctors suggest that driving may cause increased stress and blood pressure."
doc4 = "Sometimes I feel pressure to perform well at school, but my father never seems to drive my sister to do better."
doc5 = "Health experts say that Sugar is not good for your lifestyle."

# compile documents
docs = [doc1, doc2, doc3, doc4, doc5]

print(return_topic(docs))
