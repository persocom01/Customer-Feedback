from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


def sentiment_scores(sentence):
    sia = SentimentIntensityAnalyzer()
    sentiment_dict = sia.polarity_scores(sentence)
    return sentiment_dict


def classify_sentiment(sentiment_dict, threshold=0.05):
    if sentiment_dict['compound'] >= threshold:
        return 'pos'
    elif sentiment_dict['compound'] <= -threshold:
        return 'neg'
    else:
        return 'neu'
