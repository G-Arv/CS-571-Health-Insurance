import pandas as pd
import os

# Path to folder containing your CSV files
folder_path = r'C:\Users\akshi\OneDrive\Documents\GitHub\CS-571-Health-Insurance\public\data'

csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')] # List of CSV files
data_frames = []

for file in csv_files:
    file_path = os.path.join(folder_path, file)
    year = file.split('.')[0]

    try:
        df = pd.read_csv(file_path, skiprows = 4, names = ["Location", "Employer Only", "Non-group Only", "Medicaid and Private Insurance","Medicaid and Medicare", "Medicaid Only", "Medicare and Private Insurance", "Medicare Only","Military", "Uninsured", "Total", "Footnotes"])
        df = df.dropna(subset = ["Location"]).reset_index(drop = True) # Drop empty/null rows
        df["Year"] = year # Add year column
        data_frames.append(df) # Append to list   
    except Exception as e:
        print(f"Error reading {file}: {e}")

# Combine
if data_frames:
    combined_df = pd.concat(data_frames, ignore_index = True)
    output_path = os.path.join(folder_path, 'alldata.csv')
    combined_df.to_csv(output_path, index=False)
    
