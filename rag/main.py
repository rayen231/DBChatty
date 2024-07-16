import os
import shutil
from fastapi import FastAPI, File, UploadFile, Form,HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from pydantic import BaseModel  # Import BaseModel from Pydantic
from manage_db import init_db, add_document_to_db, delete_document_from_db, get_document_from_db,get_document_base_names_from_db
from reply import chat
import trranslate as tr
from docx2pdf import convert
import uvicorn
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Initialize the database on startup
@app.on_event("startup")
def on_startup():
    app.state.db = init_db()

# Configure CORS
origins = [
    "http://localhost:1420",  # Update with the origin of your Tauri app
    "http://localhost:8000",  # Update with any additional origins as needed
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Pydantic model for request body
class FileUpload(BaseModel):
    file_type: str
    language: str
    file: UploadFile

@app.post("/query")
async def process_query(query: dict):
    db = app.state.db
    query = query.get("query", '')
    # Translate the query to English
    query = tr.translate_any_to_english(query)
    
    # Search for the query in the database
    retrieved_results = db.similarity_search(query)
    context = str(retrieved_results[0]) + str(retrieved_results[1])
    print(context)
    response = chat(query, context)

    #Translate the response to Arabic  
    translated_response = tr.translate_english_to_arabic(response)
    translated_response2 = tr.translate_english_to_french(response)

    # Return the response
    return {
        "english_version": response,
        "arabic_version": translated_response,
        "french_version": translated_response2,
        "source": retrieved_results[0].metadata
    }

@app.post("/add_file")
async def add_file(
    file: UploadFile = File(...),
    language: str = Form(...)
):
    print(f"Received file: {file.filename}")
    print(f"Language: {language}")

    # Extract file extension and name
    filename, file_extension = os.path.splitext(file.filename)
    file_extension = file_extension.lower()
    print(f"Filename: {filename}")
    print(f"File extension: {file_extension}")

    # Ensure the temp_files directory exists
    script_dir = os.path.dirname(__file__)
    temp_dir = os.path.join(script_dir, "temp_files")
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    # Construct file location path using os.path.join for correct path handling
    file_location = os.path.join(temp_dir, f"{filename}{file_extension}")
    print(f"Saving file to: {file_location}")

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print("File saved successfully.")

    # If the file is .docx, convert it to .pdf
    if file_extension == '.docx':
        pdf_location = os.path.join(temp_dir, f"{filename}.pdf")
        convert(file_location, pdf_location)
        print(f"Converted {file_location} to {pdf_location}")
        os.remove(file_location)  # Remove the original .docx file
        file_location = pdf_location
        file_type = 'pdf'
    elif file_extension == '.pdf':
        file_type = 'pdf'
    else:
        return {"status": "unsupported file type"}

    # Add document metadata to the database
    status = add_document_to_db(file_location, file_type, language, f"{filename}.pdf")

    return {"status": status}



@app.post("/get_files")
async def get_files():
    db = app.state.db
    document_names = get_document_from_db(db)
    return {"files": list(document_names)}

import os

@app.delete("/delete_file/{name}")
async def delete_file(name: str):
    try:
        filename = name # Adjust the filename extension as needed
        file_path = os.path.join("temp_files", filename)  # Assuming '/temp_files' is your folder path
        
        # Check if the file exists before attempting deletion
        if os.path.exists(file_path):
            os.remove(file_path)  # Delete the file from the filesystem
        
        # Now delete the document from the database
        status = delete_document_from_db(filename)
        
        return {"status": status}
    except Exception as e:
        return {"error": f"An error occurred while deleting the document: {e}"}


########################################################################################
@app.get("/get_files_basenames")
async def get_files_basenames():
    db = app.state.db
    document_names = get_document_base_names_from_db(db)
    return {"files": list(document_names)}


#############################################################################
pdf_directory = "temp_files/"

@app.get("/get_pdf/")
async def get_pdf(filename: str):
    
    # Construct the full file path
    file_path = os.path.join(pdf_directory, filename)
    print("filename= ", filename)
    # Check if the file exists
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Return the PDF file as a FileResponse
    return FileResponse(file_path, media_type='application/pdf', filename=filename)

########################################################################################



def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "_main_":
    main()