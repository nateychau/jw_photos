# Notion-py Photography Portfolio 
A photography portfolio website built with React, Flask, and Notion-py API. Photos are saved on a table in Notion for easy uploading and management.

[Joann W Photos](http://joannwphotos.com/#/)

- React front end, bundled with webpack
- Flask back end forwarding requests to Notion API
  - Notion API accessed via [notion-py](https://github.com/jamalex/notion-py)
- [Notion](https://www.notion.so/) for content management

## About

I designed this application flow for a use case where the website owner has litte to no experience with web hosting, development, CMS, etc. The Notion platform is simple to use, yet very flexible - a perfect tool for owners to manage their photos.

### Connecting to Notion with notion-py

Notion doesn't have a public API available yet, but notion-py, a python client for Notion's private API, enables connection. I hooked up the client to a Flask app, and created several REST API endpoints for the front end to consume, as well as an index route for a single page React application. I also built a simple timed cache to avoid unnecesarry requests to Notion, but I discovered shortly after that the notion-py client itself has a built in caching mechanism that can be enabled.

```python
client = NotionClient(token_v2=f"{config.NOTION_TOKEN}")
cv = client.get_collection_view(f"https://www.notion.so{config.TABLE_KEY}")

cache = cv.collection.get_rows()
flush_date = time.time() + 604800  # 1 week from now

# if its been a week since we last made a request directly to notion,
# update the cache, and reset the flush date to 1 week from now. check_for_flush is called from all routes
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
```

### To-Do
- Front end caching; The database is not updated frequently enough to warrant a network request on every page load. Considering pulling the entire table into a global store in the front end. 
- Limit albums loaded on the index page; This would improve performance for tables with many different albums, and could even open up some new user cases. For example, this framework could be easily refactored into something more fitting for eCommerce, with Notion as an inventory management tool. 