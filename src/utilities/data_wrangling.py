# load all the json file in /Users/songhaifan/Documents/GitHub/metro_maps/src/data
# and save them in to a dictionary key as the file name and value as the json object
import matplotlib.pyplot as plt
import numpy as np
import json
import os


def load_json_files(path):
    json_files = {}
    for file in os.listdir(path):
        if file.endswith(".json"):
            with open(os.path.join(path, file), 'r') as f:
                json_files[file] = json.load(f)
    return json_files


# loop through the data and find the max and min value for all the values in data with key '
minmax = {
    "nodes": {
        "node_weight": {"min": 1, "max": 0},
        "node_weight-truth": {"min": 1, "max": 0},
    },
    "links": {
        "edge_weight": {"min": 1, "max": 0},
        "edge_weight-truth": {"min": 1, "max": 0},
    },
}

weight = {
    "nodes": {
        "node_weight": [],
        "node_weight-truth": []
    },
    "links": {
        "edge_weight": [],
        "edge_weight-truth": []
    }
}


def find_min_max_all(minmax, data):
    for type in minmax:
        for weightType in minmax[type]:
            try:
                weightArray = [item[weightType]
                               for json_data in data.values() for item in json_data[type] if weightType in item]
                weight[type][weightType] = weight[type][weightType] + weightArray
                minmax[type][weightType]["min"] = min(weightArray)
                minmax[type][weightType]["max"] = max(weightArray)
            except KeyError:
                continue
    return minmax


# normalize the data based on the minmax


def normalize_data(data, minmax):
    for type in minmax:
        for weightType in minmax[type]:
            try:
                for json_url, json_data in data.items():
                    # if url contains "dumy" then skip
                    if "dumy" in json_url:
                        continue
                    for item in json_data[type]:
                        if item[weightType] == minmax[type][weightType]["min"]:
                            item[weightType] = 0.1234567
                        item[weightType] = (item[weightType] - minmax[type][weightType]["min"]) / (
                            minmax[type][weightType]["max"] - minmax[type][weightType]["min"])
            except KeyError:
                continue
    return data

# write the data the same format to a new json file and store them in the same folder within "data_norm" folder

# overwrite the data if the file already exists


def write_data(data, path):
    for file in data:
        with open(os.path.join(path, file), 'w') as f:
            json.dump(data[file], f)


# loop through the weight dictionary and plot the histogram for each weight type


def plot_histograms(data):
    for type in data:
        for weightType in weight[type]:
            plt.hist(data[type][weightType])
            plt.xlabel(weightType)
            plt.ylabel("Frequency")
            plt.title(f"{weightType} Histogram for {type}")
            plt.show()


if __name__ == '__main__':

    data = load_json_files('src/data')
    minmax = find_min_max_all(minmax, data)
    plot_histograms(weight)
    write_data(normalize_data(data, minmax), 'src/data_norm')
    print("Normalized data saved in src/data_norm, please check the data")
    print("The min and max value for each weight type are: ", minmax)
