
import json
import os


def load_json_files(path):
    with open(path, 'r') as f:
        data = json.load(f)
    return data


data = load_json_files('src/utilities/response.json')

for each in data:
    print(each['choices'][0]['text'])
