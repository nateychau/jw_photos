from flask import Flask
from flask_cors import CORS, cross_origin
import config 
from notion.client import NotionClient

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

client = NotionClient(token_v2=f"{config.NOTION_TOKEN}")
cv = client.get_collection_view("https://www.notion.so/49b17ee8c59b4318910f3c6c7606439f?v=dec5f5ab153a4ee09b4156badd8e44d2")
database = cv.collection.get_rows() 

#get all photos
@app.route('/api/')
@cross_origin()
def get_all():
    res = {}
  
    for row in database:
        res[row.description] = {
          "album":row.album,
          "filters":row.filter,
          "image":row.image,
          "album cover": row.album_cover
        }
    
    return res 

#get all photos tagged as album covers
@app.route('/api/covers')
@cross_origin()
def get_covers():
    # cv = client.get_collection_view("https://www.notion.so/49b17ee8c59b4318910f3c6c7606439f?v=9939fa03f5144dcd8a96d525e22216ed")
    res = {}
    # filter_params = {
    #     "property": "album cover",
    #     "comparator": "is",
    #     "value": True
    # }
    # query = cv.build_query(filter=filter_params).execute()


    for row in database:
        if row.album_cover:
          res[row.album[0]] = row.image[0]

    return res

@app.route('/api/album/<album_name>')
@cross_origin()
def get_album(album_name):
    res = {}

    for row in database:
        if row.album[0] == album_name:
            res[row.id] = {
              "description": row.description,
              "image": row.image[0],
              "album": row.album[0]
            }

    return res