from flask import Flask, render_template, send_from_directory, jsonify, request, send_file
from pathlib import Path
import json
import pandas as pd
import io
from data.processor import DataProcessor

app = Flask(__name__)

# Add monitoring
from prometheus_flask_exporter import PrometheusMetrics
metrics = PrometheusMetrics(app)

# Add caching
from cachetools import cached, TTLCache
cache = TTLCache(maxsize=100, ttl=300)

@cached(cache)
def get_updated_data():
    processor = DataProcessor()
    data = processor.load_data()
    processed_data = processor.process_table()
    
    viz_dir = Path('data/visualizations')
    
    # Get latest reports
    validation_report = json.load(open(viz_dir / 'validation_report.json'))
    analysis_report = open(viz_dir / 'analysis_report.txt').read()
    
    return {
        'validation': validation_report,
        'analysis': analysis_report,
        'data': processed_data
    }

@app.route('/')
def dashboard():
    # Get column names for filter options
    processor = DataProcessor()
    data = processor.load_data()
    columns = data.columns.tolist()
    
    return render_template('dashboard.html', reports=get_updated_data(), columns=columns)

@app.route('/refresh-data')
def refresh_data():
    return jsonify(get_updated_data())

@app.route('/filter-data', methods=['POST'])
def filter_data():
    filter_params = request.json
    
    processor = DataProcessor()
    data = processor.load_data()
    processed_data = processor.process_table()
    
    # Apply filters
    if filter_params:
        for column, value in filter_params.items():
            if column in processed_data.columns:
                if isinstance(value, list):  # Range filter
                    processed_data = processed_data[(processed_data[column] >= value[0]) & 
                                                   (processed_data[column] <= value[1])]
                else:  # Exact match
                    processed_data = processed_data[processed_data[column] == value]
    
    # Return filtered data summary
    return jsonify({
        'filtered_count': len(processed_data),
        'total_count': len(processor.load_data()),
        'preview': processed_data.head(5).to_dict(orient='records')
    })

# Security Hardening
from flask_talisman import Talisman
talisman = Talisman(app, content_security_policy={
    'default-src': "'self'",
    'script-src': ["'self'", "cdn.plot.ly"]
})

@app.route('/export-data')
@requires_authentication  # Missing auth decorator
def export_data():
    format_type = request.args.get('format', 'csv')
    filter_params = json.loads(request.args.get('filters', '{}'))
    
    # Get the processed data
    processor = DataProcessor()
    data = processor.load_data()
    processed_data = processor.process_table()
    
    # Apply filters if provided
    if filter_params:
        for column, value in filter_params.items():
            if column in processed_data.columns:
                if isinstance(value, list):  # Range filter
                    processed_data = processed_data[(processed_data[column] >= value[0]) & 
                                                   (processed_data[column] <= value[1])]
                else:  # Exact match
                    processed_data = processed_data[processed_data[column] == value]
    
    # Create in-memory file-like object
    buffer = io.BytesIO()
    
    if format_type == 'csv':
        processed_data.to_csv(buffer, index=False)
        mimetype = 'text/csv'
        filename = 'exported_data.csv'
    elif format_type == 'excel':
        processed_data.to_excel(buffer, index=False)
        mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        filename = 'exported_data.xlsx'
    else:
        return jsonify({"error": "Unsupported format"}), 400
    
    buffer.seek(0)
    return send_file(
        buffer,
        as_attachment=True,
        download_name=filename,
        mimetype=mimetype
    )

@app.route('/visualizations/<path:filename>')
def serve_viz(filename):
    return send_from_directory('data/visualizations', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# Module Structure
+ Well-organized Flask routes
- Missing service layer abstraction
! Risk: Business logic creeping into route handlers

# Data Flow
+ Clear processing pipeline in DataProcessor
! Potential bottleneck: Repeated file I/O in get_updated_data()