import json
import os
from rake_nltk import Rake


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


data = load_json_files('src/data_norm')

r = Rake()


for json_url, json_data in data.items():
    for article in json_data['articles']:
        r.extract_keywords_from_text(article['full_text'])
        keywords = r.get_ranked_phrases()[:5]
        print(keywords)
        break
