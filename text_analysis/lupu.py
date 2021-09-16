# Lupusregina deals with word processing.


class Lupu:

    def __init__(self):
        # Contractions dict.
        self.contractions = {
            "n't": " not",
            "n’t": " not",
            "'s": " is",
            "’s": " is",
            "'m": " am",
            "’m": " am",
            "'ll": " will",
            "’ll": " will",
            "'ve": " have",
            "’ve": " have",
            "'re": " are",
            "’re": " are"
        }
        self.re_ref = {
            'email': r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)',
            'link': r'(https?://[^ ]+)',
            'gender_pronoun': [r'[hH]e/[hH]im', '[tT]hey/[tT]hem', '[tT]ey/[tT]em', '[eE]y/[eE]m', '[eE]/[eE]m', '[tT]hon/[tT]hon', '[fF]ae/[fF]aer', '[vV]ae/[vV]aer', '[aA]e/[aA]er', '[nN]e/[nN]ym', '[nN]e/[nN]em', '[xX]e/[xX]em', '[xX]e/[xX]im', '[xX]ie/[xX]em', '[zZ]e/[zZ]ir', '[zZ]ie/[zZ]ir', '[zZ]he/[zZ]hir', '[zZ]e/[hH]ir', '[sS]ie/[sS]ier', '[zZ]ed/[zZ]ed', '[zZ]ed/[zZ]ed', '[cC]e/[cC]ir', '[cC]o/[cC]os', '[vV]e/[vV]is', '[jJ]ee/[jJ]em', '[lL]ee/[lL]im', '[kK]ye/[kK]yr', '[pP]er/[pP]er', '[hH]u/[hH]um', '[bB]un/[bB]un', '[iI]t/[iI]t']
        }
        self.sep = ' '

    # For lowercase use the python builtin function str.lower()

    # To tokenize is to split the sentence into words.
    def re_tokenize(self, sentence, sep=r'\w+'):
        from nltk.tokenize import RegexpTokenizer
        retoken = RegexpTokenizer(sep)
        words = retoken.tokenize(sentence)
        return words

    # Lemmatizing eliminates things like the s from plurals like apples.
    def lemmatize_sentence(self, sentence):
        from nltk.stem import WordNetLemmatizer
        wnlem = WordNetLemmatizer()
        words = self.re_tokenize(sentence)
        words = [wnlem.lemmatize(word) for word in words]
        # Returns sentence instead of individual words.
        return ' '.join(words)

    # Stemming is a more drastic approach than lemmatizing. It truncates words
    # to get to the root word.
    def stem_sentence(self, sentence):
        from nltk.stem.porter import PorterStemmer
        p_stem = PorterStemmer()
        words = self.re_tokenize(sentence)
        words = [p_stem.stem(word) for word in words]
        # Returns sentence instead of individual words.
        return ' '.join(words)

    def remove_extra_spaces(self, sentence):
        sentence = sentence.rstrip()
        sentence = ' '.join(sentence.split())
        return sentence

    def remove_non_alphanumeric(self, sentence, sep=None):
        import re
        if sep is None:
            sep = self.sep
        pattern = re.compile(r'[\W_]+')
        sentence = pattern.sub(sep, sentence)
        return sentence

    def remove_numbers(self, sentence, sep=None):
        if sep is None:
            sep = self.sep
        sentence = ''.join(i if not i.isdigit() else ' ' for i in sentence)
        return sentence

    def remove_punctuation(self, sentence, sep=None):
        import re
        if sep is None:
            sep = self.sep
        pattern = re.compile(r'[!"#$%&\'()*+, -./:; <= >?@[\]^_`{|}~’“”]+')
        sentence = pattern.sub(sep, sentence)
        return sentence

    def remove_short(self, sentence, minsize=3, sep=None):
        if sep is None:
            sep = self.sep
        sentence = ' '.join([word for word in sentence.split() if len(word) >= minsize])
        return sentence

    def remove_tags(self, sentence, sep=None):
        import re
        if sep is None:
            sep = self.sep
        pattern = re.compile(r'<.*?>')
        sentence = pattern.sub(sep, sentence)
        return sentence

    def split_camel_case(self, sentence):
        import re
        splitted = re.sub('([A-Z][a-z]+)', r' \1',
                          re.sub('([0-9A-Z]+)', r' \1', sentence)).split()
        return ' '.join(splitted)

    def corpus_cleaner(self, corpus, *args, sep=None, inplace=False):
        '''
        Function made to make chain transformations on text lists easy.

        Maps words when passed functions or dictionaries as *arguments.
        Removes words when passed lists or strings.

        Aside from lists, all *arguments should be made in regex format, as the
        function does not account for spaces or word boundaries by default.
        '''
        import re
        if inplace is False:
            corpus = corpus.copy()
        if sep is None:
            sep = self.sep

        # Prevents KeyError from passing a pandas series with index not
        # beginning in 0.
        try:
            iter(corpus.index)
            r = corpus.index
        except TypeError:
            r = range(len(corpus))

        for i in r:
            for arg in args:
                # Maps text with a function.
                if callable(arg):
                    corpus[i] = arg(corpus[i])
                # Maps text defined in dict keys with their corresponding
                # values.
                elif isinstance(arg, dict):
                    for k, v in arg.items():
                        corpus[i] = re.sub(k, v, corpus[i])
                # Removes all words passed as a list.
                elif not isinstance(arg, str):
                    for a in arg:
                        pattern = re.compile(r'\b{}\b'.format(a))
                        corpus[i] = pattern.sub(sep, corpus[i])
                # For any other special cases.
                else:
                    corpus[i] = re.sub(arg, sep, corpus[i])
        return corpus

    # A set of steps for basic text preprocessing.
    def simple_preprocess(self, corpus):
        from nltk.corpus import stopwords
        return self.corpus_cleaner(
            corpus,
            str.lower,
            self.remove_tags,
            self.contractions,
            self.remove_punctuation,
            r'[^a-zA-Z ]',
            stopwords.words('english'),
            self.remove_short,
            self.lemmatize_sentence,
            self.remove_extra_spaces
            )

    def word_cloud(self, text, figsize=(12.5, 7.5), max_font_size=None, max_words=200, background_color='black', mask=None, recolor=False, export_path=None, **kwargs):
        '''
        Plots a wordcloud.

        Use full_text = ' '.join(list_of_text) to get a single string.
        '''
        import numpy as np
        import matplotlib.pyplot as plt
        from PIL import Image
        from wordcloud import WordCloud, ImageColorGenerator

        fig, ax = plt.subplots(figsize=figsize)
        if mask:
            m = np.array(Image.open(mask))
            cloud = WordCloud(background_color=background_color,
                              max_words=max_words, mask=m, **kwargs)
            cloud.generate(text)
            if recolor:
                image_colors = ImageColorGenerator(mask)
                ax.imshow(cloud.recolor(color_func=image_colors),
                          interpolation='bilinear')
            else:
                ax.imshow(cloud, interpolation='bilinear')
        else:
            cloud = WordCloud(background_color=background_color,
                              max_words=max_words, **kwargs)
            cloud.generate(text)
            ax.imshow(cloud, interpolation='bilinear')
        if export_path:
            cloud.to_file(export_path)
        ax.axis('off')
        plt.show()
        plt.close()
