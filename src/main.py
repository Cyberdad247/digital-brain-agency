from data.processor import DataProcessor
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from pathlib import Path
import argparse
import plotly.express as px
import plotly.graph_objects as go
import json

def validate_data(data):
    validation_results = {
        "missing_values": data.isnull().sum().to_dict(),
        "duplicates": data.duplicated().sum(),
        "numeric_columns": data.select_dtypes(include=['float64', 'int64']).columns.tolist()
    }
    return validation_results

def create_interactive_plots(data, viz_dir):
    # Interactive time series
    if 'date' in data.columns or 'timestamp' in data.columns:
        time_col = 'date' if 'date' in data.columns else 'timestamp'
        numeric_cols = data.select_dtypes(include=['float64', 'int64']).columns
        fig = px.line(data, x=time_col, y=numeric_cols)
        fig.write_html(viz_dir / 'interactive_timeseries.html')

    # Interactive correlation matrix
    numeric_data = data.select_dtypes(include=['float64', 'int64'])
    fig = px.imshow(numeric_data.corr(), 
                    labels=dict(color="Correlation"),
                    color_continuous_scale="RdBu")
    fig.write_html(viz_dir / 'interactive_correlation.html')

def export_data(data, viz_dir, formats):
    for fmt in formats:
        if fmt == 'csv':
            data.to_csv(viz_dir / 'processed_data.csv', index=False)
        elif fmt == 'excel':
            data.to_excel(viz_dir / 'processed_data.xlsx', index=False)
        elif fmt == 'json':
            data.to_json(viz_dir / 'processed_data.json', orient='records')
        elif fmt == 'parquet':
            data.to_parquet(viz_dir / 'processed_data.parquet')

def analyze_data(data, export_formats=None):
    # Create visualization directory
    viz_dir = Path('data/visualizations')
    viz_dir.mkdir(parents=True, exist_ok=True)
    
    # Validate data
    validation_results = validate_data(data)
    with open(viz_dir / 'validation_report.json', 'w') as f:
        json.dump(validation_results, f, indent=4)
    
    # Create interactive visualizations
    create_interactive_plots(data, viz_dir)
    
    # Original static plots
    summary = data.describe()
    
    # Time series analysis
    plt.figure(figsize=(12, 6))
    sns.set_style("whitegrid")
    if 'date' in data.columns or 'timestamp' in data.columns:
        time_col = 'date' if 'date' in data.columns else 'timestamp'
        plt.plot(data[time_col], data.select_dtypes(include=['float64', 'int64']).mean(axis=1))
        plt.title('Time Series Analysis')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(viz_dir / 'time_series.png')
        plt.close()
    # Distribution plots
    for column in data.select_dtypes(include=['float64', 'int64']).columns:
        plt.figure(figsize=(10, 6))
        sns.histplot(data[column], kde=True)
        plt.title(f'Distribution of {column}')
        plt.savefig(viz_dir / f'dist_{column}.png')
        plt.close()
    # Correlation heatmap
    plt.figure(figsize=(12, 8))
    numeric_data = data.select_dtypes(include=['float64', 'int64'])
    sns.heatmap(numeric_data.corr(), annot=True, cmap='coolwarm')
    plt.title('Correlation Matrix')
    plt.tight_layout()
    plt.savefig(viz_dir / 'correlation.png')
    plt.close()
    # Generate summary report
    with open(viz_dir / 'analysis_report.txt', 'w') as f:
        f.write("Data Analysis Report\n")
        f.write("==================\n\n")
        f.write(f"Total Records: {len(data)}\n")
        f.write(f"Columns: {', '.join(data.columns)}\n\n")
        f.write("Statistical Summary:\n")
        f.write(str(summary))
    return summary, validation_results
    # Export data in requested formats
    if export_formats:
        export_data(data, viz_dir, export_formats)
    
    return summary, validation_results

def main():
    parser = argparse.ArgumentParser(description='Data Analysis Tool')
    parser.add_argument('--formats', nargs='+', 
                       choices=['csv', 'excel', 'json', 'parquet'],
                       help='Export formats')
    parser.add_argument('--skip-plots', action='store_true',
                       help='Skip generating plots')
    args = parser.parse_args()

    processor = DataProcessor()
    data = processor.load_data()
    processed_data = processor.process_table()
    
    # Run analysis
    analysis_results, validation = analyze_data(
        processed_data,
        export_formats=args.formats
    )
    
    print("\nAnalysis Summary:")
    print("================")
    print(f"Records processed: {len(processed_data)}")
    print(f"Missing values found: {sum(validation['missing_values'].values())}")
    print(f"Duplicate records: {validation['duplicates']}")
    print("\nCheck data/visualizations/ for detailed results.")

if __name__ == "__main__":
    main()