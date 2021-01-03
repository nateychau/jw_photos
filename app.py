from flask import Flask
from flask_cors import CORS, cross_origin
import config
from notion.client import NotionClient

# for cache refreshing
import time

app = Flask(__name__, static_folder="./frontend", static_url_path="/")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

client = NotionClient(token_v2=f"{config.NOTION_TOKEN}")
cv = client.get_collection_view(
    "https://www.notion.so/49b17ee8c59b4318910f3c6c7606439f?v=dec5f5ab153a4ee09b4156badd8e44d2")

cache = cv.collection.get_rows()
flush_date = time.time() + 604800  # 1 week from now

# if its been a week since we last made a request directly to notion,
# update the cache, and reset the flush date to 1 week from now


def check_for_flush():
    global flush_date
    print('current flush date', time.localtime(flush_date))
    ttl = flush_date - time.time()
    if ttl < 0:
        print('flushing cache')
        global cache
        cache = cv.collection.get_rows()
        flush_date = time.time() + 604800
    else:
        print('did not flush')
    print('next flush date', time.localtime(flush_date))


# index route
@app.route('/')
def index():
    return app.send_static_file('index.html')

# handle react rerouting


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# get all photos


@app.route('/api/')
@cross_origin()
def get_all():
    check_for_flush()
    res = {}
    cache = cv.collection.get_rows(search="teasdfadfadfasdfst")
    if not cache:
        return {"test": "no results"}

    for row in cache:
        res[row.description] = {
            "album": row.album,
            "filters": row.filter,
            "image": row.image,
            "album cover": row.album_cover
        }

    return res

# get all photos tagged as album covers


@app.route('/api/covers')
@cross_origin()
def get_covers():
    check_for_flush()
    res = {}
    # filter_params = {
    #     "property": "album cover",
    #     "comparator": "is",
    #     "value": True
    # }
    # query = cv.build_query(filter=filter_params).execute()

    for row in cache:
        if row.album_cover:
            res[row.album[0]] = {
                "image": row.image[0],
                "filters": [filter.lower() for filter in row.filter]
            }

    return res

# get photos by album name


@app.route('/api/album/<album_name>')
@cross_origin()
def get_album(album_name):
    check_for_flush()
    res = {}

    for row in cache:
        if row.album[0] == album_name:
            res[row.id] = {
                "text": row.text,
                "description": row.description,
                "image": row.image[0],
                "album": row.album[0],
                "filters": row.filter
            }

    return res

# get photos by filter


@app.route('/api/filters/<filter_name>')
@cross_origin()
def get_filtered(filter_name):
    check_for_flush()
    res = {}

    for row in cache:
        if filter_name.capitalize() in row.filter:
            res[row.id] = {
                "description": row.description,
                "image": row.image[0],
                "album": row.album[0]
            }

    return res

# get list of filters
# not completely sure if this is the best way to get filters...
# might make more sense to dynamically generate filter list in front end based on photos received
# Response structure:
# {
#   id: ...,
#   name: "Filter",
#   options: [
#     {
#       color: ...
#       id: ...,
#       value: <filter_name>
#     },
#     {
#       color: ...
#       id: ...,
#       value: <filter_name2>
#     }
#   ],
#   slug: "filter",
#   type: "multi_select"
# }


@app.route('/api/filters')
@cross_origin()
def get_filters():
    check_for_flush()
    options = cv.collection.get_schema_property("filter")
    return options
