import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

df = pd.read_csv('./sentiment_analysis/data/Reviews.csv')
df.head()
