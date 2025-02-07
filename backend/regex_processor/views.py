
'''
This is where the actual business logic for file processing, 
interacting with the OpenAI API, and returning the processed data happens.
'''


import os                                                  #For interacting with the operating system                
import csv                                      
import logging
from openpyxl import load_workbook
from django.http import JsonResponse                       #For returning JSON responses in Django.
from django.core.files.storage import FileSystemStorage    # For handling file uploads and storage.
from dotenv import load_dotenv                             #For loading environment variables from a .env file
from django.views.decorators.csrf import csrf_exempt       #For disabling CSRF protection on a view.
from .models import ProcessedFile                          #For interacting with the ProcessedFile model in the database.
import openai                                              #For interacting with the OpenAI API.
import re

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Constants
#  Maximum allowed file size
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
# List of allowed file types
ALLOWED_TYPES = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]
openai.api_key = os.getenv("OPENAI_API_KEY")



def validate_file(uploaded_file):
    """Validate file size, type, and structure."""
    if uploaded_file.size > MAX_FILE_SIZE:
        raise ValueError("File size exceeds the maximum limit of 10MB.")
    
    if uploaded_file.content_type not in ALLOWED_TYPES:
        raise ValueError("Unsupported file type. Only CSV and Excel files are allowed.")
    
    # Validate CSV header
    if uploaded_file.content_type == 'text/csv':
        with uploaded_file.open('r') as f:
            header = f.readline().decode('utf-8').strip().split(',')
            if not header:
                raise ValueError("Invalid CSV file: No header found.")



def parse_csv(file_path):
    """Parse a CSV file and return rows as a list of dictionaries."""
    rows = []
    with open(file_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            rows.append(row)
    return rows



def parse_excel(file_path):
    """Parse an Excel file and return rows as a list of dictionaries."""
    rows = []
    workbook = load_workbook(file_path)
    sheet = workbook.active
    headers = [cell.value for cell in sheet[1]]  # First row as headers
    for row in sheet.iter_rows(min_row=2, values_only=True):
        rows.append(dict(zip(headers, row)))
    return rows



def get_regex_from_openai(user_input):

    # replace the next line symbol with a space
    user_input = user_input.replace('\n', '')
    
    """Call OpenAI API to generate regex pattern, column name, and displacement."""
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": f"Generate a regex pattern for: {user_input}, "
                           f"and only give me the regex_pattern, the column_name the user_input wants to replace, "
                           f"and the displacement user wants to use. Format: 'regex_pattern:..., column_name:..., displacement:...'"
            }],
            max_tokens=100,
            temperature=0,
        )
        result = response.choices[0].message.content


        # Use regex to extract the values
        regex_pattern = re.search(r"regex_pattern:\s*([^,]+)", result)
        column_name = re.search(r"column_name:\s*([^,]+)", result)
        displacement = re.search(r"displacement:\s*([^,]+)", result)

        # Extract the values or return None if not found
        regex_pattern = regex_pattern.group(1).strip() if regex_pattern else None
        column_name = column_name.group(1).strip() if column_name else None
        displacement = displacement.group(1).strip() if displacement else None




        # result = result.split(' ')

        # regex_pattern = result[0].split('regex_pattern:')[1].strip()[:-1]
        # column_name = result[1].split('column_name:')[1].strip()[:-1]
        # displacement = result[2].split('displacement:')[1].strip()[:-1]
        
        return regex_pattern, column_name, displacement
    

    except Exception as e:
        logger.error(f"Error generating regex from OpenAI: {str(e)}")
        raise ValueError("Failed to generate regex pattern from OpenAI.")



def apply_regex_to_data(data, column_name, displacement):
    """Apply regex replacement to the specified column in the data."""
    processed_data = []
    for row in data:
        processed_row = {}
        for key, value in row.items():
            if key.lower() == column_name.lower():
                processed_row[key] = displacement
            else:
                processed_row[key] = value
        processed_data.append(processed_row)
    return processed_data


# Main View Function
@csrf_exempt
def process_file(request):
    """Handle file upload, processing, and response."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:

        
        uploaded_file = request.FILES.get('file')
        user_input = request.POST.get('user_input')

        # Validate inputs
        if not uploaded_file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        if not user_input:
            return JsonResponse({'error': 'No user input provided'}, status=400)

        # Validate file
        validate_file(uploaded_file)

        # Save the file temporarily
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_path = fs.path(filename)

        # Parse the file
        file_extension = filename.split('.')[-1].lower()
        if file_extension == 'csv':
            rows = parse_csv(file_path)
        elif file_extension in ['xlsx', 'xls']:
            rows = parse_excel(file_path)
        else:
            return JsonResponse({'error': 'Unsupported file format'}, status=400)

        # Generate regex and process data
        regex_pattern, column_name, displacement = get_regex_from_openai(user_input)
        processed_data = apply_regex_to_data(rows, column_name, displacement)

        # Save processed data to the database
        processed_record = ProcessedFile.objects.create(
            filename=uploaded_file.name,
            user_input=user_input,
            processed_data={
                'data': processed_data,
                'regex_pattern': regex_pattern
            }
        )

        # Clean up
        fs.delete(filename)

        return JsonResponse({
            'processed_data': processed_data,
            'regex_pattern': regex_pattern
        }, status=200)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
    
