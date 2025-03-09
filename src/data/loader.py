import pandas as pd

def load_processing_table():
    return pd.read_csv(
        r"c:\Users\vizio\Desktop\digital-brain-agency-clone\data\raw\processing_table.csv",
        parse_dates=['timestamp'],
        dtype={'priority': 'int8', 'status': 'category'}
    )