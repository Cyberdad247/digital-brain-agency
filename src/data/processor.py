import pandas as pd
from pathlib import Path

class DataProcessor:
    def __init__(self):
        self.data_path = Path(r"c:\Users\vizio\Desktop\digital-brain-agency-clone\data\raw\processing_table.csv")
        self.df = None

    def load_data(self):
        self.df = pd.read_csv(self.data_path)
        return self.df

    def process_table(self):
        if self.df is None:
            self.load_data()
        
        # Process the data
        processed_df = self.df.copy()
        # Add your specific processing logic here
        
        return processed_df

    def save_processed_data(self, output_filename='processed_data.csv'):
        output_path = self.data_path.parent.parent / 'processed' / output_filename
        output_path.parent.mkdir(exist_ok=True)
        self.df.to_csv(output_path, index=False)