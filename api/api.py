from flask import Flask
from flask_cors import CORS, cross_origin
import config 
from notion.client import NotionClient

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

client = NotionClient(token_v2=f"{config.NOTION_TOKEN}")

cv = client.get_collection_view("https://www.notion.so/49b17ee8c59b4318910f3c6c7606439f?v=dec5f5ab153a4ee09b4156badd8e44d2")
#get all photos
@app.route('/api/')
@cross_origin()
def get_all():
    res = {}
    for row in cv.collection.get_rows():
        res[row.description] = {
          "album":row.album,
          "filters":row.filter,
          "image":row.image
        }
    
    return res 

#get all photos tagged as album covers
@app.route('/api/covers')
@cross_origin()
def get_covers():
    # cv = client.get_collection_view("https://www.notion.so/49b17ee8c59b4318910f3c6c7606439f?v=9939fa03f5144dcd8a96d525e22216ed")
    res = {}

    filter_params = {
        "property": "album cover",
        "comparator": "is",
        "value": True
    }

    query = cv.build_query(filter=filter_params).execute()
    # query = cv.default_query().execute()
    # print(query)
    for row in query:
        res[row.description] = {
          "album":row.album,
          "filters":row.filter,
          "image":row.image,
          "album cover":row.album_cover
        }

    return res
