from nltk.stem import PorterStemmer
import json
import os
import re
from rake_nltk import Rake
from sklearn.feature_extraction.text import TfidfVectorizer

from nltk.corpus import stopwords
tfidf_vectorizer = TfidfVectorizer(stop_words=stopwords.words('english'))


# create a stemmer object
stemmer = PorterStemmer()


def load_json_files(path):
    json_files = {}
    for file in os.listdir(path):
        if file.endswith(".json"):
            with open(os.path.join(path, file), 'r') as f:
                json_files[file] = json.load(f)
    return json_files


def write_data(data, path):
    for file in data:
        with open(os.path.join(path, file), 'w') as f:
            json.dump(data[file], f)


data = load_json_files('src/data_new')

r = Rake()

# initialize TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words=stopwords.words('english'))

corpus = []

for json_url, json_data in data.items():
    for article in json_data['articles']:
        corpus.append(article['full_text'])

# fit the vectorizer to the corpus
tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

keywords_by_doc = []

for i in range(len(corpus)):
    # get the TF-IDF scores for the current document
    scores = zip(tfidf_vectorizer.get_feature_names_out(),
                 tfidf_matrix[i].toarray()[0])
    # sort the scores by descending order
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    # extract the top 5 keywords
    top_keywords = []
    for word, score in sorted_scores:
        # remove non-words and words containing non-alphabetic characters
        if not re.match(r'^[a-zA-Z]+$', word):
            continue
        # stem the word
        stemmed_word = stemmer.stem(word)
        # remove similar words
        if stemmed_word in top_keywords:
            continue
        top_keywords.append(stemmed_word)
        if len(top_keywords) == 5:
            break

    # top_keywords = [word for word, score in sorted_scores[:5]]
    # store the keywords for the current document
    keywords_by_doc.append(top_keywords)


# print(keywords_by_doc)

for json_url, json_data in data.items():
    for article in json_data['articles']:
        article['keywords'] = keywords_by_doc.pop(0)


write_data(data, 'src/data_new')


# [['dog', 'convention', 'coat', 'comic', 'mayor'], ['computers', 'librarians', 'robbery', 'room', 'library'], ['teens', 'arrested', 'computer', 'authorities', 'school'], ['brandi', 'spann', 'money', 'amount', 'recovered'], ['bioterrorism', 'publication', 'cdc', 'supply', 'food'], ['patino', 'bioterrorism', 'professor', 'prepared', 'university']]


# for json_url, json_data in data.items():
#     for article in json_data['articles']:
#         # split text into sentences by ". "
#         r.extract_keywords_from_sentences(article['full_text'].split(". "))
#         # r.extract_keywords_from_text(article['full_text'])
#         keywords = [phrase for phrase in r.get_ranked_phrases() if len(phrase.split()) <= 3][:5]
#         print(keywords)
#         break

# ['white trim around', 'purple lace applicas', 'cape made like', 'favorite comic character', 'coat fully extending']
# ['restrictive confidentiality agreement', 'former chairman lied', 'research center --', 'research center reflected', 'written several weeks']
# ['johnetta wally', 'group executive director', 'staff members involved', '10 issues', 'charge last fall']
# ['donor country investment', 'friedman bernard army', 'terrible things continue', 'reduced military spending', 'less terrible place']
# ['fell 70 cents', 'developer cheung kong', 'hongkong telecommunications ltd', 'east asia ltd', 'larger h shares']
