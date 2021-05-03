from flask import Flask
from flask_cors import CORS, cross_origin
import config
from notion.client import NotionClient
from python_util.about import About

# for cache refreshing
import time

#BEGIN MONKEY PATCH 
import notion 
def store_recordmap(self, recordmap):
    for table, records in recordmap.items():
        if records is None: continue
        for id, record in records.items():
            self._update_record(
                table, id, value=record.get("value"), role=record.get("role")
            )

def call_load_page_chunk(self, page_id):

        if self._client.in_transaction():
            self._pages_to_refresh.append(page_id)
            return

        data = {
            "pageId": page_id,
            "limit": 100,
            "cursor": {"stack": []},
            "chunkNumber": 0,
            "verticalColumns": False,
        }

        recordmap = self._client.post("loadPageChunk", data).json()["recordMap"]

        self.store_recordmap(recordmap)

notion.store.RecordStore.call_load_page_chunk = call_load_page_chunk
notion.store.RecordStore.store_recordmap = store_recordmap
#END MONKEY PATCH

app = Flask(__name__, static_folder="./frontend", static_url_path="/")
app.config['CORS_HEADERS'] = 'Content-Type'

# this can probably replace the timed cache implemented below
client = NotionClient(token_v2=f"{config.NOTION_TOKEN}")
                      #enable_caching=True, monitor=True, start_monitoring=True)

about_block = client.get_block(f"https://www.notion.so/{config.ABOUT_KEY}")

@app.route('/api/about')
@cross_origin()
def get_about():
    return About(about_block).to_dict() #set up server side caching for this


cv = client.get_collection_view(f"https://www.notion.so/{config.TABLE_KEY}")
cache = cv.collection.get_rows()
flush_date = time.time() + 604800  # 1 week from now

#collection is cached on the server on start up, and refreshed once a week
# if its been a week since we last made a request directly to notion,
# update the cache, and reset the flush date to 1 week from now
def check_for_flush():
    global flush_date
    # print('current flush date', time.localtime(flush_date))
    ttl = flush_date - time.time()
    if ttl < 0:
        # print('flushing cache')
        global cv
        cv.refresh() #refresh the collection and save to cache
        global cache
        cache = cv.collection.get_rows()
        flush_date = time.time() + 604800
    else:
        print('did not flush')
    # print('next flush date', time.localtime(flush_date))

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

# index route
@app.route('/')
def index():
    return app.send_static_file('index.html')

# handle react rerouting


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# get all photos
@app.route('/api')
@cross_origin()
def get_all():
    check_for_flush()
    res = {}

    for row in cache:
        res[row.description] = {
            "album": row.album,
            "filters": row.filter,
            "image": row.image,
            "album_cover": row.album_cover,
            "orientation": row.orientation
        }
    
    return res

# get all photos tagged as album covers


@app.route('/api/covers')
@app.route('/api/covers/<filter>')  # filter is optional
@cross_origin()
def get_covers(filter=False):
    # start = time.process_time()
    check_for_flush()
    res = {}
    # filter_params = {
    #     "property": "album cover",
    #     "comparator": "is",
    #     "value": True
    # }
    # query = cv.build_query(filter=filter_params).execute()
    for row in cache:
        if row.album_cover and (not filter or filter.capitalize() in row.filter):
            res[row.album[0]] = {
              "image": row.image[0],
              "orientation": row.orientation.lower()
            }
    # print(f"time to fetch: {time.process_time() - start}")
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
                "image": row.image[0],
                "filters": row.filter,
                "orientation": row.orientation.lower()
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

# get all filter names (for header)


@app.route('/api/filters')
@cross_origin()
def get_filters():

    options = cv.collection.get_schema_property("filter")
    return options
