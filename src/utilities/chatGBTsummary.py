import json
import os
import openai

API_KEY = "sk-YBSHO1Ukeb9geabCinosT3BlbkFJ6oBPOIcoAmlQl46NFtXQ721"

openai.api_key = API_KEY

model = "text-davinci-003"


def get_gbt_response(text):
    prompt = f""" I have some news texts for you to work on. As a journalist, I'd like you to  provide a concise, simple, short, and eye-catching news headline based on the summary. You just need to give me the headline only. Following is the text: {text}"""
    response = openai.Completion.create(
        model=model,
        prompt=prompt,
        temperature=0.5,
        max_tokens=500,
    )
    return response


def cache_gbt_response(response):
    with open("src/utilities/response.json", "a") as f:
        json.dump(response, f)


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


data = load_json_files('src/data')


def get_headline(data):
    for json_url, json_data in data.items():
        for node in json_data['nodes']:
            all_title = ''
            all_text = ''
            for article_id in node['articles']:
                for article in json_data['articles']:
                    if article['id'] == article_id:
                        all_title += article['title']
                        all_text += article['title']+': '+article['text']
            node['all_title'] = all_title
            node['all_text'] = all_text
            if len(all_text.split()) > 2500:
                short_all_text = ' '.join(all_text.split()[:2500])
            else:
                short_all_text = all_text
            response = get_gbt_response(short_all_text)
            cache_gbt_response(response)
            node['headline'] = response.choices[0].text.strip().replace(
                '\n', '').replace('Headline: ', '')

    return data


new_data = get_headline(data)

print("start writing data")

write_data(new_data, 'src/data_gbt')
