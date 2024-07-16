import shutil
import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from docx2pdf import convert
from langchain_community.document_loaders.csv_loader import CSVLoader


def init_files():
    loader = PyPDFDirectoryLoader('data')  # PDF directory loader
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    documents = text_splitter.split_documents(docs)
    return documents


def read_pdf(pdf_path):
    print("readpdf function : ",pdf_path)
    if not os.path.exists(pdf_path):
        print("PDF file does not exist in the directory.")
        return []

    if os.path.isdir(pdf_path):
        print("PDF path is a directory, not a file.")
        return []

    # Open the PDF file
    with open(pdf_path, 'rb') as file:
        pdf_data = file.read()

    # Write the PDF data to a new file in the temp_files directory
    pdf_name = os.path.basename(pdf_path)
    pdf_name = os.path.splitext(pdf_name)[0]
    print(pdf_name)

    # Ensure the data directory exists
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    new_pdf_path = os.path.join(data_dir, f'{pdf_name}.pdf')
    with open(new_pdf_path, 'wb') as file:
        file.write(pdf_data)

    loader = PyPDFLoader(new_pdf_path)  # PDF loader
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    documents = text_splitter.split_documents(docs)
    return documents



def read_docx(docx_path):
    docx_name = os.path.basename(docx_path)
    docx_name = os.path.splitext(docx_name)[0]
    print(docx_name)
    pdf_path = os.path.join('data', f'{docx_name}.pdf')
    if not os.path.exists(pdf_path):
        convert(docx_path, pdf_path)

    return read_pdf(pdf_path)


def read_csv(csv_path):
    csv_name = os.path.basename(csv_path)
    csv_name = os.path.splitext(csv_name)[0]
    new_csv_path = os.path.join('data', f'{csv_name}.csv')

    if not os.path.exists(new_csv_path):
        shutil.copyfile(csv_path, new_csv_path)

    loader = CSVLoader(file_path=new_csv_path)
    data = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)
    documents = text_splitter.split_documents(data)
    return documents


# Testing
#print(read_docx(r'C:\Users\Rayen\Downloads\Rayen-Ben-Aziza.docx'))
#print(read_csv(r'C:\Users\Rayen\Downloads\SampleCSVFile_119kb.csv'))
#print(init_files())
