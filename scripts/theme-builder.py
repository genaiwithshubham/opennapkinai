import json

with open("output.json", "r") as f:
    data = json.load(f)

color_mapping = {}

unique_colors = []

for diagram_name, diagram_data in data.items():
    colors = []
    for element in diagram_data:
        colors.append(element["options"]["fill"])
        unique_colors.append(element["options"]["fill"])
    color_mapping[diagram_name] = colors

print(list(set(unique_colors)))

# print(json.dumps(color_mapping, indent=4))