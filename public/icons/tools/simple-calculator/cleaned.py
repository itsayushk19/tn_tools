import csv

# Specify the input and output file paths
input_file = 'cleaned_data.csv'
output_file = 'labeled.csv'

# Define the list of keywords or phrases to search for
keywords = ['GeForce Now', 'Nvidia GeForce Now', 'GPN', 'Epic Game', 'Epic Game Store', 'Epic Games', 'Epic Games Store', 'Steam', 'Ubisoft', 'NVIDIA GEFORCE RTX', 'GEFORCE GTX', 'GEFORCE RTX', 'NVIDIA GEFORCE GTX', 'Cloud Gaming', 'PC Game', 'PC Games', 'PC Gaming']

# Function to check if any keyword or phrase is present in the text
def contains_keywords(text):
    for keyword in keywords:
        if keyword.lower() in text.lower():
            return True
    return False

# Open the input CSV file
with open(input_file, 'r', newline='', encoding='utf-8') as csv_in_file:
    # Read the CSV file
    reader = csv.DictReader(csv_in_file)
    
    # Get the fieldnames from the reader
    fieldnames = reader.fieldnames
    
    # Add the "Label" fieldname
    fieldnames.append('Label')
    
    # Open the output CSV file
    with open(output_file, 'w', newline='', encoding='utf-8') as csv_out_file:
        # Create a writer object and write the fieldnames
        writer = csv.DictWriter(csv_out_file, fieldnames=fieldnames)
        writer.writeheader()
        
        # Iterate over the rows in the input CSV file
        for row in reader:
            # Get the text from the "Text" column
            text = row['Text']
            
            # Check if any keyword or phrase is present in the text
            if contains_keywords(text):
                row['Label'] = '1'
            else:
                row['Label'] = '0'
            
            # Write the updated row to the output CSV file
            writer.writerow(row)
