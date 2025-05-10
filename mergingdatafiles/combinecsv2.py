"""
import pandas as pd
import os

folder_path = r'C:\Users\akshi\OneDrive\Documents\GitHub\CS-571-Health-Insurance\data3'

csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')] # List of CSV files
data_frames = []

for file in csv_files:
    file_path = os.path.join(folder_path, file)
    year = file.split('.')[0]

    try:
        df = pd.read_csv(file_path, skiprows = 4, names = ["Location", "Total Health Spending"])
        df = df.dropna(subset = ["Location"]).reset_index(drop = True) # Drop empty/null rows
        df["Total Health Spending"] = df["Total Health Spending"].replace('[\$,]', '', regex = True) 
        df["Total Health Spending"] = pd.to_numeric(df["Total Health Spending"], errors='coerce')
        df["Year"] = year # Add year column
        data_frames.append(df) # Append to list   
    except Exception as e:
        print(f"Error reading {file}: {e}")

# Combine
if data_frames:
    combined_df = pd.concat(data_frames, ignore_index = True)
    output_path = os.path.join(folder_path, 'alldata2.csv')
    combined_df.to_csv(output_path, index=False)
    


"""
