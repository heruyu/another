from flask import Flask, jsonify, request
from PyPDF2 import PdfReader
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfpage import PDFTextExtractionNotAllowed
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfdevice import PDFDevice
from pdfminer.layout import LAParams
from pdfminer.converter import PDFResourceManager, PDFPageAggregator
from pdfminer.pdfpage import PDFPage
from pdfminer.layout import LTTextBoxHorizontal
from pdfminer.pdfparser import PDFParser, PDFSyntaxError
from pdfminer.pdfdocument import PDFDocument, PDFNoOutlines
from flask_cors import CORS
import yake
import sumy
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer
import nltk
import os.path
import os
import shutil
import sys
import pymongo
from pymongo import MongoClient
import pandas as pd
import numpy as np
from bson import json_util, BSON
from bson.json_util import ObjectId
import json
import contextlib
from pathlib import Path
import seedir
import re

CONNECTION_STRING = "mongodb://localhost:27017"
client = MongoClient(CONNECTION_STRING)
db = client.data_control_app
table_in = db.file_properties

app = Flask(__name__)
cors = CORS(app)
user_files_dir = os.getcwd().rsplit("\\",1)[0]+"\\user_files"

@app.route("/")
def main():
    print("from server")
    return {"temp": ["t1","t2","t3","t4","t5"]}

@app.route("/upload", methods=["POST","GET"])
def upload():
    #jeżeli plik ma dobry typ (pdf, txt, json, csv, jpg/png)
    #zawartość pliku
    #tagi
    #info (typ, nazwa)
    #reload the filetree
    x = request.json
    basename = os.path.basename(x["path"])
    target_name = user_files_dir + "\\" + basename
    mes = "works"
    #copy
    if os.path.exists(target_name):
        output = {"code":1,
                  "message":"file already exists in targed directory"}
    elif not os.path.exists(x["path"]):
        output = {"code":2,
                  "message":"selected source file path does not exist, please check the path"}
    else:
        if x["method"] == "copy":
            shutil.copy2(x["path"], target_name)
        else:
            os.rename(x["path"], target_name)
        #content extraction
        t_file = open(target_name, "rb")

        res =""
        rsrcmgr = PDFResourceManager()
        # Set parameters for analysis.
        laparams = LAParams()
        # Create a PDF page aggregator object.
        device = PDFPageAggregator(rsrcmgr, laparams=laparams)
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        for page in PDFPage.get_pages(t_file):
            interpreter.process_page(page)
        # receive the LTPage object for the page.
            layout = device.get_result()
            for element in layout:
                if isinstance(element, LTTextBoxHorizontal):
                    res=res+element.get_text()

        res = re.sub(r"-\s",'',res) #hyphens
        res = re.sub(';','.',res) 

        #ligatures
        lig = {'\uFB00':"ff",'\uFB01':"fi",
               '\uFB02':"fl",'\uFB03':"ffi",
               '\uFB04':"ffl",'\uFB06':"st",'\u2022':'.'}
        for x,y in lig.items():
            res = re.sub(x,y,res)

        res = re.sub(r'([^0-9]\.)\d+',r'\1',res)

        #tags
        lang = "en"
        max_ngram_size = 3
        deduplication_treshold = 0.5
        num_keywords = 6
        kw_extract = yake.KeywordExtractor(lan=lang,n=max_ngram_size,
                                           dedupLim=deduplication_treshold, 
                                           top=num_keywords, features=None)
        
        keywords = kw_extract.extract_keywords(res)
        tags = [kw[0].lower() for kw in keywords]
        main_title = basename

        # checking the pdf file contents
        with open('../user_files/temp.txt', 'w') as f:
            f.write(res.encode('ascii',errors='replace').decode('ascii'))
        f.close()

        parser = PDFParser(t_file)
        document = PDFDocument(parser)
        
        try:
            outlines = document.get_outlines()
            t = [title for (level,title,des,a,se) in outlines]
            main_title = t[0]
        except PDFNoOutlines:
            pass
        
        # print(main_title, file=sys.stderr)

        parser = PlaintextParser.from_string(res,Tokenizer("english"))
        summarizer = TextRankSummarizer()
        summary =summarizer(parser.document,2)
        text_summary=""

        for sentence in summary:
            text_summary=text_summary+" "+str(sentence)
        
        insert = {"_id":str(ObjectId()),
                  "basename":basename,
                  "main title":main_title,
                  "targetDir":target_name,
                  "keywords":tags,
                  "summary":text_summary}
        with contextlib.suppress(TypeError):
            table_in.insert_one(insert)
        output = {"code":0,
                  "message":"done"}
            
    return output
    
@app.route("/search_view", methods=["GET", "POST"])
def search():
    word = request.json["word"].lower()
    i = 1
    temp = {}
    for x in table_in.find({"keywords":word}, {"_id":0, "basename": 1, "main title": 1, "keywords":1,"summary":1}): 
        temp = {**temp,**{i:x}}
        i=i+1
    res = {"word":word,"all":temp}
    return json.dumps(res,indent=4)

@app.route("/filetree", methods=["POST","GET"])
def filetree():
    dir_tree = create_folder_structure_json(user_files_dir)
    dir_tree_json = json.dumps(dir_tree,indent=4)
    # print(dir_tree,file=sys.stderr)
    return dir_tree_json

def create_folder_structure_json(path): 
    result = {'text': os.path.basename(path), 
              'type': 'folder', 'children': []} 
  
    if not os.path.isdir(path): 
        return result 
  
    for entry in os.listdir(path): 
        entry_path = os.path.join(path, entry) 
  
        if os.path.isdir(entry_path): 
            result['children'].append(create_folder_structure_json(entry_path)) 
        else: 
            result['children'].append({'text': entry, 'type': 'file'}) 
  
    return result 

if __name__ == "__main__":
    app.run(debug=True)