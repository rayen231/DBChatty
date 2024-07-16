# DBChatty

DBChatty is a web and desktop application that connects to a local server's database to manage and display files. It offers a comprehensive library where users can search, delete, and add documents. Additionally, it features "Chaty," a chatbot based on the LLAMA3 model utilizing Retrieval-Augmented Generation (RAG) to answer user queries based on the database contents, providing the source of the information, and predicting answers for questions not directly covered by the database.

## Features
- **Library Management**: Search, delete, and add documents.
- **Chatbot (Chaty)**: 
  - Based on LLAMA3 model.
  - Uses RAG to answer questions with database information.
  - Provides sources for the information.
  - Can predict answers not found in the database.

## Technologies Used
- **Frontend**: React.js
- **Desktop Application**: Tauri.js, Rust
- **Backend**: Python (Langchain, FastAPI, CReW AI)

## Installation Instructions

### Backend Setup
1. Navigate to the `rag` folder.
2. Install the required libraries:
    ```bash
    pip install -r requirements.txt
    ```
3. Ensure Python and Visual C++ Build Tools are installed.
4. Run the API:
    ```bash
    uvicorn main:app --host 0.0.0.0
    ```

### Frontend Setup
1. Ensure Node.js is installed.
2. Navigate to the project directory and install dependencies:
    ```bash
    npm install
    ```
3. Run the application:
    ```bash
    npm run tauri dev --host 0.0.0.0
    ```

## Usage
- Follow the installation instructions above to set up the backend and frontend.
- Use the library page to navigate, search, delete, and add documents.
- Use the Chaty section to interact with the chatbot.

## Contributing
We welcome contributions from anyone interested in improving DBChatty. Please contact us for more information.

## License
[Specify your chosen license here]

## Contact Information
- **Email**: rayenbenaziza1234@gmail.com
- **LinkedIn**: [Your LinkedIn Profile Link]
