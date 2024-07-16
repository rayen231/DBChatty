import os
from crewai import Agent, Task, Crew, Process

def config():
    os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
    os.environ["OPENAI_MODEL_NAME"] = 'llama3-70b-8192'  # Adjust based on available model
    os.environ["GROQ_API_KEY"] = 'your_api_key'  # Adjust based on your OpenAI API key
    GROQ_API_KEY = ""

def chat(input, context):
    config()
    document_assistant = Agent(
        role="Document Analysis Assistant",
        goal="To assist users in reading, understanding, and replying to information in PDF and data files using advanced retrieval-augmented generation (RAG) techniques.",
        backstory="As a highly trained Document Analysis Assistant, I specialize in extracting relevant information from documents, providing summaries, answering queries, and facilitating effective communication based on document content.",
        verbose=True,
        allow_delegation=False
    )
    
    document_task = Task(
        description=f"""Assist the user with the following task: {input}
                        based on this pdf context context: {context}""",
        agent=document_assistant,
        expected_output="Welcome to the Document Analysis Assistant Chatbot!"
    )
    
    crew = Crew(
        agents=[document_assistant],
        tasks=[document_task],
        verbose=1,
        process=Process.sequential,
        Output_Log_File=True
    )
    
    output = crew.kickoff()
    
    return output

#Example usage:
#result = chat("hello what are the steps to apply for a job?")
#print(result)
