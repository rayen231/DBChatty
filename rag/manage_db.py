import shutil
from langchain_community.vectorstores import Chroma
from embedding_fun import embedding
from manage_docs import init_files, read_pdf, read_docx, read_csv
import os
import trs

embeddings = embedding()
documents = init_files()
chroma_path = 'db'

# Initialize the database
def init_db():
    if not os.path.exists(chroma_path):
        db = Chroma.from_documents(documents, embeddings, persist_directory=chroma_path)
    else:
        #db = Chroma.load(persist_directory=chroma_path)
        db = Chroma(persist_directory=chroma_path, embedding_function=embeddings)

    for file in os.listdir('data'):
        if file.endswith('.csv'):
            db.add_documents(read_csv(os.path.join('data', file)))

    print(get_document_from_db(db))
    return db


# Function to check if a document is already in the database
def document_exists(db, name):
    documents= list(get_document_base_names_from_db(db))
    if name in documents:
        return True 
    else:
        return False
# Function to retrieve documents from the database
def get_document_from_db(db):
    documents_set = set()
    for x in range(len(db.get()["ids"])):
        doc = db.get()["metadatas"][x]
        documents_set.add(doc["source"])
    return documents_set

# Function to add a document to the database
def add_document_to_db(path_to_doc, doc_type, language, file_name):
    try:
        db = Chroma(persist_directory=chroma_path, embedding_function=embeddings)

        # Check if document already exists
        if document_exists(db, file_name):
            return f"Document {file_name} is already in the database."

        # Store the original path
        original_path = path_to_doc

        # Handle non-English PDF files
        if language != 'en' and doc_type == "pdf":
            print(f"Original PDF path: {path_to_doc}")
            path_to_doc = trs.translate_pdf(path_to_doc)
            print(f"Translated PDF path: {path_to_doc}")
            documents = read_pdf(path_to_doc)

        # Handle non-English DOCX files
        elif language != 'en' and doc_type == "docx":
            print(f"Original DOCX path: {path_to_doc}")
            path_to_doc = trs.translate_docx(path_to_doc, dest_lang='en')
            print(f"Translated DOCX path: {path_to_doc}")
            documents = read_docx(path_to_doc)

            # Delete the original DOCX file
            if os.path.exists(original_path):
                os.remove(original_path)
                print(f"Deleted original DOCX file: {original_path}")

        # Handle English files directly
        else:
            if doc_type == "pdf":
                print(f"Original PDF path in manage_db: {path_to_doc}")
                documents = read_pdf(path_to_doc)
            elif doc_type == "docx":
                documents = read_docx(path_to_doc)
            elif doc_type == "csv":
                documents = read_csv(path_to_doc)
            else:
                return f"Unsupported document type: {doc_type}"

        db.add_documents(documents)
        return f"Document {file_name} added to the database."

    except Exception as e:
        return f"An error occurred: {e}"


# Function to delete a document from the database
def delete_document_from_db(name):
    try:
        db = Chroma(persist_directory=chroma_path, embedding_function=embeddings)
        if not document_exists(db, name):
            return f"Document {name} is not in the database."

        ids_to_delete = []
        data = db.get()

        for x in range(len(data["ids"])):
            full_path= r'' + data["metadatas"][x]["source"]
            filename = os.path.basename(full_path)   
            print(filename)

            if filename == name:
                ids_to_delete.append(data["ids"][x])
        print(f"Deleting document with ID: {ids_to_delete}")
        db._collection.delete(ids=ids_to_delete)
        name= os.path.join('data', name)
        os.remove(name)
        return f"Document {name} deleted from the database."

    except Exception as e:
        return f"An error occurred while deleting the document: {e}"
##################################{ added }######################################
# Function to retrieve base names of documents from the database
def get_document_base_names_from_db(db):
    base_names_set = set()
    for x in range(len(db.get()["ids"])):
        doc = db.get()["metadatas"][x]
        base_name = os.path.basename(doc["source"])
        base_names_set.add(base_name)
    return base_names_set
# Testing
#if __name__ == "__main__":
    #db=init_db()
    #print(document_exists(db, 'arabic-1333488651 (3).docx'))
    #print(delete_document_from_db('arabic-1333488651 (3).pdf'))
    #print(get_document_from_db(db))
    #add_document_to_db('arabic-1333488651 (3).docx', 'docx', 'ar')
    #translated_docx_path = trs.translate_docx('arabic-1333488651 (3).docx', dest_lang='en')
    #print("Translated DOCX saved at:", translated_docx_path)
    # Add additional tests as needed