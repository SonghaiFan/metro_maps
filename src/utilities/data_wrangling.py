# load all the json file in /Users/songhaifan/Documents/GitHub/metro_maps/src/data
# and save them in to a dictionary key as the file name and value as the json object
import matplotlib.pyplot as plt
import numpy as np
import json
import os
import seaborn as sns


def load_json_files(path):
    json_files = {}
    for file in os.listdir(path):
        if file.endswith(".json"):
            with open(os.path.join(path, file), 'r') as f:
                json_files[file] = json.load(f)
    return json_files


# loop through the data and find the max and min value for all the values in data with key '

def update_min_max(item, weightType, minmax, type):
    if item[weightType] > minmax[type][weightType]["max"]:
        minmax[type][weightType]["max"] = item[weightType]
    if item[weightType] < minmax[type][weightType]["min"]:
        minmax[type][weightType]["min"] = item[weightType]


def find_min_max_all(data, ignore_dumy):
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
    for type in minmax:
        for weightType in minmax[type]:
            for json_url, json_data in data.items():
                # if ignore_dumy is true, url contains "dumy" then skip
                if ignore_dumy and ("dummy" in json_url):
                    continue
                for item in json_data[type]:
                    if "node_weight" in item and "node_weight-truth" not in item:
                        item["node_weight-truth"] = item["node_weight"]
                    if "edge_weight" in item and "edge_weight-truth" not in item:
                        item["edge_weight-truth"] = item["edge_weight"]
                    if weightType in item:
                        weight[type][weightType].append(item[weightType])
                        update_min_max(item, weightType, minmax, type)
    return minmax, weight


# normalize the data based on the minmax
def minmax_normalization(item, type, weightType, minmax):
    min = minmax[type][weightType]["min"]
    max = minmax[type][weightType]["max"]
    norm_weight = (item[weightType] - min) / (max - min)
    return norm_weight


def normalize_data(data, minmax, ignore_dumy):
    for type in minmax:
        for weightType in minmax[type]:
            for json_url, json_data in data.items():
                if ignore_dumy and ("dummy" in json_url):
                    continue
                for item in json_data[type]:
                    if weightType in item:
                        item[weightType] = minmax_normalization(
                            item, type, weightType, minmax)
    return data

# write the data the same format to a new json file and store them in the same folder within "data_norm" folder

# overwrite the data if the file already exists


def write_data(data, path):
    for file in data:
        with open(os.path.join(path, file), 'w') as f:
            json.dump(data[file], f)


# loop through the weight dictionary and plot the histogram for each weight type

# plot four histograms on one chart


def plot_histograms(weight_before, weight_after, name, is_dummy_ignore):
    fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(10, 8))
    _axes = axes.flatten()
    i = 0
    for type in weight_before:
        for weightType in weight_before[type]:
            _axes[i].hist([weight_before[type][weightType], weight_after[type][weightType]], color=[
                          'r', 'b'], label=['before', 'after'])
            _axes[i].set_xlabel(weightType)
            _axes[i].set_ylabel("Frequency")
            _axes[i].set_title(f"{weightType} Histogram for {type}")
            _axes[i].legend()
            i += 1
    fig.tight_layout()
    plt.savefig(f'src/img/weight_{name}_is_dum_ig_{str(is_dummy_ignore)}.png')


def plot_density(weight_before, weight_after, name, is_dummy_ignore):
    fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(10, 8))
    _axes = axes.flatten()
    i = 0
    for type in weight_before:
        for weightType in weight_before[type]:
            before = sns.kdeplot(
                weight_before[type][weightType], ax=_axes[i], label='before', color='r')
            before.set_label("before")
            after = sns.kdeplot(
                weight_after[type][weightType], ax=_axes[i], label='after', color='b')
            after.set_label("after")
            _axes[i].set_xlabel(weightType)
            _axes[i].set_ylabel("Density")
            _axes[i].set_title(f"{weightType} Density Plot for {type}")
            _axes[i].legend()
            i += 1
    fig.tight_layout()
    plt.savefig(f'src/img/weight_{name}_is_dum_ig_{str(is_dummy_ignore)}.png')


if __name__ == '__main__':
    # ask user to input the is_dummy_ignore value
    is_dummy_ignore = input(
        "Do you want to ignore the dummy data? (y/n): ") == 'y'

    # load the data
    data = load_json_files('src/data')
    minmax, weight = find_min_max_all(data, is_dummy_ignore)
    print("=====================================")
    print("The min and max value for each weight type are: ", minmax)
    # plot_histograms(weight, 'original')

    # normalize the data
    norm_data = normalize_data(data, minmax, is_dummy_ignore)
    norm_minmax, norm_weight = find_min_max_all(norm_data, is_dummy_ignore)
    print("=====================================")
    print("The min and max value in normalized data are : ", norm_minmax)
    plot_histograms(weight, norm_weight, 'histogram', is_dummy_ignore)
    plot_density(weight, norm_weight, 'density', is_dummy_ignore)

    # save the normalized data
    write_data(norm_data, 'src/data_norm')
    print()
    print("Normalized data saved in src/data_norm, please check the data")
