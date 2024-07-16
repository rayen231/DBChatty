from langchain_community.embeddings import JinaEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
api_key = 'YOUR_API_KEY'

model_name = "sentence-transformers/all-mpnet-base- v2"
model_kwargs = {'device': 'GPU:0'}
encode_kwargs = {'normalize_embeddings': False}

def embedding():
    embeddings = JinaEmbeddings(jina_api_key=api_key, model_name='jina-embeddings-v2-base-en')
    #embeddings = HuggingFaceEmbeddings(
    #model_name=model_name,
    #model_kwargs=model_kwargs,
    #encode_kwargs=encode_kwargs
#)
    return embeddings

#To note : * the hugging face embedding works good but with a really long time to process the document
#          * the jina embedding works good and fast and the results are even more accurate