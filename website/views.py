import pandas as pd
tracked_filenames = []
from flask import Blueprint, render_template, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
import os
from werkzeug.utils import secure_filename
from sqlalchemy.orm import sessionmaker
from .models import Image
from sqlalchemy import or_
import json
import shutil
from datetime import datetime
import copy

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import load_model

import io
import base64
import base64
import numpy as np
import io
from PIL import Image, UnidentifiedImageError
import tensorflow as tf
import keras.applications
from keras.models import Sequential, load_model
from keras.preprocessing.image import ImageDataGenerator, img_to_array
from keras.applications.mobilenet import MobileNet
from keras.applications.mobilenet import preprocess_input


# Connect to the database
db = SQLAlchemy()
engine = db.create_engine("sqlite:///database/imageDataAssetManagementTool.db")

# Create a session to interact with the database
Session = sessionmaker(bind=engine)
session = Session()

views = Blueprint('views', __name__)

@views.route('/')
def index():
    page = request.args.get('page', 1, type=int)  # Get the page number from the URL query parameter (default is 1)
    per_page = 20  # Set the number of items per page
    
    start = (page - 1) * per_page
    end = start + per_page

    # Define the path to the "uploads" directory
    uploads_dir = os.path.join(os.getcwd(), 'website', 'static', 'uploads')

    # Check if the "uploads" directory exists
    if os.path.exists(uploads_dir) and os.path.isdir(uploads_dir):
        # List the files in the "uploads" directory
        file_names = os.listdir(uploads_dir)

        # Filter only image files based on their extensions
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        image_files = [file_name for file_name in file_names if os.path.splitext(file_name)[1].lower() in image_extensions]

        # Get the search term from the query parameter for filename search
        filename_search_term = request.args.get('filename', '')

        # Get the TreeID search term from the query parameter
        tree_id_search_term = request.args.get('treeid', '')

        
        # Initialize variables for filenamd and TreeID search
        matching_filename = None
        is_filename_search = False
        is_tree_id_search = False

        # Locate a CSV file in the "uploads" directory (customize your criteria)
        csv_file = None
        for file_name in file_names:
            if file_name.endswith('.csv'):
                csv_file = file_name
                break

        if csv_file:
            # Construct the path to the CSV file
            csv_path = os.path.join(uploads_dir, csv_file)

            # Read the CSV file here and store it in df
            df = pd.read_csv(csv_path)
        else:
            df = None

        # Get the filter query parameter from the URL
        filter_query = request.args.get('filter', '')

        # Split the filter query into individual filter components
        filter_components = filter_query.split('+')

        # Initialize variables to store filter values
        diagnosis_filter = ''
        author_filter = ''
        part_filter = ''
        status_filter = ''
        location_filter = ''

        # Check if there are enough components in the filter
        if len(filter_components) >= 5:
            diagnosis_filter = filter_components[0]
            author_filter = filter_components[1]
            part_filter = filter_components[2]
            status_filter = filter_components[3]
            location_filter = filter_components[4]

        # Filter image files based on the filename search term
        filtered_image_files = [file_name for file_name in image_files if filename_search_term.lower() in file_name.lower()]
        
        # Check if it's a filename search and perform the search
        if filename_search_term:
            # Perform TreeID search and find the associated filename
            matching_filename = find_filename_by_filename(filename_search_term)
            if matching_filename:
                is_filename_search = True
            else:
                filtered_image_files = []
                
        # Check if it's a TreeID search and perform the search
        if tree_id_search_term:
            # Perform TreeID search and find the associated filenames
            matching_filenames = find_filenames_by_tree_id(tree_id_search_term)
            if matching_filenames:
                filtered_image_files = list(set(filtered_image_files) & set(matching_filenames))
            else:
                filtered_image_files = []
            
        # Use the functions to find filenames based on selected values
        if diagnosis_filter:
            selected_diagnoses = diagnosis_filter.split('+')
            matching_filenames = find_filenames_by_diagnosis(selected_diagnoses)
            
            if matching_filenames:
                # Update the filter to use the filtered filenames
                filtered_image_files = list(set(filtered_image_files) & set(matching_filenames))
            else:
                filtered_image_files = []

        if author_filter:
            author_files = find_filenames_by_author(author_filter)
            if author_files:
                # Update the filter to use SQLAlchemy's 'in_' function
                filtered_image_files = list(set(filtered_image_files) & set(author_files))
                # Filter the database query using 'in_'
            else:
                filtered_image_files = []

        if part_filter:
            parts_files = find_filenames_by_part(part_filter)
            if parts_files:
                # Update the filter to use SQLAlchemy's 'in_' function
                filtered_image_files = list(set(filtered_image_files) & set(parts_files))
                # Filter the database query using 'in_'
            else:
                filtered_image_files = []

        if status_filter:
            status_files = find_filenames_by_status(status_filter)
            if status_files:
                # Update the filter to use SQLAlchemy's 'in_' function
                filtered_image_files = list(set(filtered_image_files) & set(status_files))
                # Filter the database query using 'in_'
            else:
                filtered_image_files = []

        if location_filter:
            location_files = find_filenames_by_location(location_filter)
            if location_files:
                # Update the filter to use SQLAlchemy's 'in_' function
                filtered_image_files = list(set(filtered_image_files) & set(location_files))
                # Filter the database query using 'in_'
            else:
                filtered_image_files = []

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return render_template('gallery_content.html', file_names=filtered_image_files[start:end])
        else:
            # Handle regular page request as before
            return render_template('index.html', file_names=filtered_image_files[start:end], df=df, filename_search_term=filename_search_term, is_filename_search=is_filename_search, tree_id_search_term=tree_id_search_term, is_tree_id_search=is_tree_id_search, matching_filename=matching_filename, diagnosis_filter=diagnosis_filter, author_filter=author_filter, part_filter=part_filter, status_filter=status_filter, location_filter=location_filter, page=page, per_page=per_page, total_files=len(filtered_image_files))
    else:
        # Handle the case when the "uploads" directory does not exist
        return render_template('index.html', file_names=[], message="Uploads directory is empty or doesn't exist.")



# Route for upload POST method
@views.route('/upload', methods=['POST'])
def upload_folder():
    uploaded_files = request.files.getlist('folder')

    if uploaded_files:
        destination_dir = os.path.join(os.getcwd(), 'website', 'static', 'uploads')
        os.makedirs(destination_dir, exist_ok=True)

        for uploaded_file in uploaded_files:
            filename = secure_filename(uploaded_file.filename)
            uploaded_file.save(os.path.join(destination_dir, filename))

        # Find directory where files are uploaded
        uploads_dir = os.path.join(os.getcwd(), 'website', 'static', 'uploads')
        file_names = os.listdir(uploads_dir)
        
        # Locate a CSV file in the "uploads" directory (customize your criteria)
        csv_file = None
        for file_name in file_names:
            if file_name.endswith('.csv'):
                csv_file = file_name
                break
            
        # Ensure there is a CSV file
        if csv_file:
            # Construct the path to the CSV file
            csv_path = os.path.join(uploads_dir, csv_file)

            # Read the CSV file here and store it in df
            df = pd.read_csv(csv_path)
        
            # Populate db with the contents from csv
            with engine.connect() as conn, conn.begin():
                df.to_sql("banana_image", conn, if_exists="replace", index=False)

        return jsonify({"message": "Files uploaded successfully"})

    return jsonify({"error": "No files uploaded"}), 400

# Route for reading CSV POST method
@views.route('/process_csv', methods=['POST'])
def process_csv():
    destination_dir, filename = handle_file_upload(request, 'csv_file', os.path.join(os.getcwd(), 'website', 'static', 'uploads'))

    if destination_dir and filename:
        # Read the uploaded CSV file
        csv_path = os.path.join(destination_dir, filename)
        df = pd.read_csv(csv_path)

        # Track filenames in the CSV file
        track_filenames(df)
        
        print("Track filenames called")

        return jsonify({"message": "CSV uploaded and processed successfully"})

    return jsonify({"error": "No file uploaded"}), 400

# Common function to handle file uploads
def handle_file_upload(request, upload_field_name, destination_dir):
    uploaded_file = request.files.get(upload_field_name)

    if uploaded_file:
        os.makedirs(destination_dir, exist_ok=True)

        filename = secure_filename(uploaded_file.filename)
        uploaded_file.save(os.path.join(destination_dir, filename))

        return destination_dir, filename

    return None, None

def track_filenames(df):
    # Assuming that 'Filename' is the column where filenames are stored
    filenames = df['Filename'].tolist()

    # Track filenames in your CSV file (for example, you can append them to a list)
    tracked_filenames.extend(filenames)
    print("Tracked Filenames:", tracked_filenames)  # Added tracker


@views.route("/add_categories", methods=["POST"])
def add_categories():
    categories_in_json = request.form.get("categories-in-json")
    
    # Update categories.json when there are newly added options
    if categories_in_json:
        with open("website/static/json/categories.json", "w") as file:
            print(f"ASD ASD{categories_in_json}")
            print("DITO")
            categories = json.loads(categories_in_json)
            json.dump(categories, file, indent=4)
        print("New category option added")
    else:
        print("No given category")
    
    return redirect("/")


@views.route('/update_metadata', methods=['POST'])
def update_metadata():
    diagnoses = []
    categories = []
    categories_in_json = request.form.get("categories-in-json")
    
    # Update categories.json when there are newly added options
    if categories_in_json:
        with open("website/static/json/categories.json", "w") as file:
            print(f"ASD ASD{categories_in_json}")
            print("DITO")
            categories = json.loads(categories_in_json)
            json.dump(categories, file, indent=4)
    else:
        with open("website/static/json/categories.json", "r") as file:
            print("DITE")
            categories = json.load(file)

    # Save values of diagnosis checkboxes in diagnoses list
    for diagnosis in categories["diagnosis"]:
        diagnoses.append(request.form.get(f"{diagnosis}-checkbox"))

    # Get the value of select input fields
    author = request.form.get("author-select")
    parts = request.form.get("part-select")
    status = request.form.get("status-select")
    location = request.form.get("location-select")
    filename = request.form.get("filename-input")

    # Remove all None in diagnosis, leave only the checked diagnosis
    diagnoses = [diagnosis for diagnosis in diagnoses if diagnosis]
    # Map category name with the given answer
    answers = {
        "author": author, 
        "part": parts, 
        "status": status, 
        "location": location,
    }
    
    print("UPDATING METADATA")

    # Ensure filename exists
    if not filename:
        print("No filename checked")
        return redirect("/")

    # Ensure at least one diagnosis is checked
    if not diagnoses:
        print("No diagnosis checked")
        return redirect("/")

    # Ensure that if healthy is checked, no other diagnosis are checked
    if "Healthy" in diagnoses and len(diagnoses) != 1:
        print("Healthy cannot be associated with other diagnosis")
        return redirect("/")

    # Ensure checked diagnoses are valid
    for diagnosis in diagnoses:
        if diagnosis not in categories["diagnosis"]:
            print("INVALID diagnosis", diagnosis)
            return redirect("/")

    # Ensure all inputs are not null
    if not all(answers):
        print("INVALID", "SOME ANSWERS WERE EMPTY")
        return redirect("/")

    # Ensure the selected options are valid
    for answer in answers:
        if answers.get(answer) not in categories.get(answer):
            print("INVALID OPTION", answers.get(answer), categories.get(answer))
            return redirect("/")

    # Prepare raw sql query and its parameters
    # Convert diagnoses list into string
    diagnoses = "; ".join(diagnoses)
    query_params = {
        "diagnosis": diagnoses,
        "author": author,
        "parts": parts,
        "status": status,
        "location": location,
        "filename": filename
    }
    query = """
                UPDATE banana_image
                SET diagnosis = :diagnosis, 
                    author = :author, 
                    part = :parts, 
                    status = :status, 
                    location = :location
                WHERE filename = :filename
            """

    # Update database
    with engine.connect() as conn, conn.begin():
        conn.execute(text(query), query_params)

    print(f"EDITED")

    return redirect("/")

# Function to find the corresponding image filename by filename
def find_filename_by_filename(filename):
    image = session.query(Image).filter(Image.filename.ilike(filename)).first()
    print(f"Searching for filename: {filename}")
    print(f"Found image: {image.filename if image else 'None'}")
    return image.filename if image else None

# Function to find filenames by treeID
def find_filenames_by_tree_id(tree_id):
    images = session.query(Image).filter(Image.treeID == tree_id).all()
    return [image.filename for image in images]

# Function to find filenames by Diagnosis
def find_filenames_by_diagnosis(selected_diagnoses):
    selected_diagnoses = [diagnosis.lower() for diagnosis in selected_diagnoses]
    images = session.query(Image).all()
    
    # Create a dictionary to store the count of matching diagnoses for each filename
    filename_counts = {}
    
    for image in images:
        diagnoses = image.diagnosis.lower().split(';')  # Split diagnoses by semicolon
        match_count = 0
        
        for diag in diagnoses:
            if any(selected_diag in diag.strip() for selected_diag in selected_diagnoses):
                match_count += 1
                
        if match_count >= 1:
            filename_counts[image.filename] = match_count

    # Filter filenames with at least 1 matching diagnosis
    filtered_filenames = [filename for filename, count in filename_counts.items() if count >= 1]

    return filtered_filenames

# Function to find filenames by Author
def find_filenames_by_author(author):
    images = session.query(Image).filter(Image.author.ilike(author)).all()
    return [image.filename for image in images]

# Function to find filenames by Part
def find_filenames_by_part(part):
    images = session.query(Image).filter(Image.part.ilike(part)).all()
    return [image.filename for image in images]

# Function to find filenames by Status
def find_filenames_by_status(status):
    images = session.query(Image).filter(Image.status.ilike(status)).all()
    return [image.filename for image in images]

# Function to find filenames by Location
def find_filenames_by_location(location):
    images = session.query(Image).filter(Image.location.ilike(location)).all()
    return [image.filename for image in images]

@views.route('/get_details/<filename>')
def get_details(filename):
    # Connect to the database
    conn = engine.connect()

    try:
        try: 
            # Query the database for the details of the image with the given filename
            result = conn.execute(
                text("SELECT * FROM banana_image WHERE filename = :filename"),
                {"filename": filename}  # Use a parameterized query
            )

            # Fetch the first row (since filename should be unique)
            row = result.fetchone()

            if row:
                print(row)  # Add this line to see the contents of 'row'
                return jsonify({
                    'filename': row[0],
                    'diagnosis': row[1],
                    'treeID': row[2],
                    'author': row[3],
                    'part': row[4],
                    'status': row[5],
                    'location': row[6],
                    'captureTime': row[7],
                    'modifiedTime': row[8]
        })
            else:
                return jsonify({"error": "File not found"}), 404
        
        except:
            # Query the database for the details of the image with the given filename
            result = conn.execute(
                text("SELECT * FROM banana_image WHERE imageID = :filename"),
                {"filename": filename}  # Use a parameterized query
            )

            # Fetch the first row (since filename should be unique)
            row = result.fetchone()

            if row:
                print(row)  # Add this line to see the contents of 'row'
                return jsonify({
                    'filename': row[0],
                    'diagnosis': row[1],
                    'treeID': row[2],
                    'author': row[3],
                    'part': row[4],
                    'status': row[5],
                    'location': None,
                    'captureTime': None,
                    'modifiedTime': None
        })
            else:
                return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return a JSON error response
    finally:
        # Close the database connection
        conn.close()

@views.route('/quarantine', methods=["POST"])
def quarantine():
    filename = request.form.get("filename-input")

    # Ensure filename is not empty
    if not filename:
        print("No filename")
        return redirect("/")
    
    # TODO: Check if already Quarantined

    # Prepare SQL query and parameters
    query =  """
                UPDATE banana_image
                SET status = 'Quarantined'
                WHERE filename = :filename
            """
    query_params = {"filename": filename}

    # Update the database
    with engine.connect() as conn, conn.begin():
        conn.execute(text(query), query_params) 

    # Construct the source and destination paths
    source_path = os.path.join(os.getcwd(), 'website', 'static', 'uploads', filename)
    destination_dir = os.path.join(os.getcwd(), 'website', 'static', 'temp')

    # Ensure the "temp" directory exists
    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)

    destination_path = os.path.join(destination_dir, filename)
    
    try:
        shutil.copy(source_path, destination_path)  # Copy the file to "temp"
    except OSError as e:
        print(f"Error moving file: {e}")
        # Handle the error appropriately, e.g., return an error response
    
    return redirect("/")

def get_model():
    global model
    model = load_model('input model here')
    print(" * Model loaded!")

# def preprocess_images(image, target_size):
#     if image.mode != "RGB":
#         image = image.convert("RGB")
#     image = image.resize(target_size)
#     image = img_to_array(image)
#     image = np.expand_dims(image, axis=0)
    
#     return image


@views.route("/diagnose_specimen", methods=["POST"])
def diagnose_specimen():
    try:
        message = request.get_json(force=True)
        print("Received message:", message)  # Add this line for debugging
        encoded = message.get('image')
        print("Received encoded image data:", encoded)  # Add this line for debugging

        if encoded:
            try:
                decoded = base64.b64decode(encoded)
                print("Decoding successful")
            except Exception as decode_error:
                print("Error decoding base64 data:", decode_error)
                # Handle the decoding error, e.g., return an error response
            else:
                print("No image data provided in the request")
                # Handle the case when no image data is provided

            try:
                image = Image.open(io.BytesIO(decoded))
                image = image.convert('RGB')  # Ensure the image is in RGB format
                image = image.resize((224, 224))  # Resize the image to the desired input size
                processed_image = preprocess_input(tf.convert_to_tensor(np.array(image, dtype=np.float32)[tf.newaxis]))
                prediction = model.predict(processed_image).tolist()

                response = {
                    'prediction': {
                        'Black sigatoka': prediction[0][0],
                        'Bunchy top': prediction[0][1],
                        'Healthy': prediction[0][2]
                    }
                }
                return jsonify(response)
            except UnidentifiedImageError:
                error_response = {'error': 'Unidentified image format'}
                return jsonify(error_response), 400  # HTTP 400 Bad Request
        else:
            error_response = {'error': 'Image not provided in the request'}
            return jsonify(error_response), 400  # HTTP 400 Bad Request
    except Exception as e:
        # Handle other exceptions
        error_response = {'error': 'Internal server error'}
        return jsonify(error_response), 500  # HTTP 500 Internal Server Error


@views.route("/diagnose_batch", methods=["POST"])
def diagnose_batch():
    print("PUMASOK?")

    # TODO: Get the model
    model = load_model("models/laguna_banana_model_resnet92.41.h5")

    # TODO: Decode jpg to insteaad of png
    message = request.get_json(force=True)
    images_paths = message["images_paths"]
    images_info = [{"path": path} for path in images_paths] 

    # TODO: Get all urls
    for image_info in images_info:
        path = image_info["path"]
        parts_of_path = path.split("/")
        for part in parts_of_path:
            if part == "static":
                break
            parts_of_path.pop(0)
            
        print(parts_of_path)
        path = "/".join(parts_of_path)
        path = os.path.join("website", path)
        print(path)
        image_info["image-id"] = parts_of_path[-1]
        image_info["path"] = path



    print(images_info)
    # print(decoded_images)
    
    predictions = ["Healthy", "Bunchy Top", "Black Sigatoka"]
    for image_info in images_info:
        path = image_info["path"]
        # Preprocess image
        print(path)
        image = tf.image.decode_image(tf.io.read_file(path))

        image = tf.image.resize(image, (224, 224))
        # processed_image = image / 255.0   
        processed_image = np.expand_dims(image, axis=0)
        
        # Predict
        prediction = model.predict(processed_image).tolist()
        prediction_index = [i for i, confidence in enumerate(prediction[0]) if confidence == max(prediction[0])]

        image_info["prediction"] = "; ".join([predictions[i] for i in prediction_index])
        image_info["confidence"] = f"{prediction[0][prediction_index[0]]:.4f}"


    print(images_info)

    data = {
        "imageID": [image_info.get("imageID") for image_info in images_info],
        "disease": [image_info.get("disease") for image_info in images_info],
        "treeID": [image_info.get("treeID") for image_info in images_info],
        "author": [image_info.get("author") for image_info in images_info],
        "part": [image_info.get("part") for image_info in images_info],
        "integrity": [image_info.get("integrity") for image_info in images_info],
        "prediction": [image_info.get("prediction") for image_info in images_info],
        "confidence": [image_info.get("confidence") for image_info in images_info],
    }
    
    for datum in copy.deepcopy(data):
        if not any(data.get(datum)):
            data.pop(datum)

    now = datetime.now()
    now = now.strftime("%m-%d-%Y_%H-%M-%S")


    df = pd.DataFrame(data)
    output_file = f"{now}.csv"
    
    output_path = os.path.join("website", "static", "csv", "batch_inference", output_file)
    print(output_path)
    df.to_csv(output_path, index=False)

    return jsonify("Created Batch Inference file CSV (seen at ./website/static/csv/batch_inference).")


# TOOO:
# - LOADING WHEN BACKEND IS WORKING ON BATCH INFERENCE
# - GET OTHER INFO TO INCLUDE IN CSV
# - SUCCESS MESSAGE/ERROR MESSAGE
# - CATCH ERROR WITH WRONG MODEL
# - FIX BUG SA UPLOAD NA D NADEDELETE UNG DATING UPLOADS
# - ADD COMMENTS TO NOTEBOOK
# - UPLOAD JUPYTER NOTEBOOKS
# - ADD FAVICON AND ICON
# - ADD MY TEST RESULT FOR TESTING MODEL