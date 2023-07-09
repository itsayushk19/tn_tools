import json

# Open the JSON file
with open('output.json', 'r') as file:
    data = json.load(file)

# Create a new list to store the filtered items
filtered_data = []

# Iterate over each item in the JSON data
for item in data:
    url = item.get('URL', '')
    title = item.get('Title', '')

    # Check if the URL starts with the specified prefixes or is empty
    if not url.startswith('https://wccftech.com/topic') and not url.startswith('https://wccftech.com/author') and url != '':
        # Check if the title is not empty
        if title != '':
            # Add the item to the filtered data
            filtered_data.append(item)

# Write the filtered data back to the JSON file
with open('filtered_data.json', 'w') as file:
    json.dump(filtered_data, file, indent=4)
