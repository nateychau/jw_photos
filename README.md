# Notion-py Photography Portfolio 
A photography portfolio website built with React, Flask, and Notion-py API. Photos are saved on a table in Notion for easy uploading and management.

[Joann W Photos](http://joannwphotos.com/#/)

- React front end, bundled with webpack
- Flask back end forwarding requests to Notion API
  - Notion API accessed via [notion-py](https://github.com/jamalex/notion-py)
- [Notion](https://www.notion.so/) for content management

## About

I designed this application flow for a use case where the website owner has litte to no experience with web hosting, development, CMS, etc. The Notion platform is simple to use, yet very flexible - a perfect tool for owners to manage their photos. Functionally, the site is static, and simply reads from a Notion table, but there are plenty of other use cases for using Notion .

### Connecting to Notion with notion-py

Notion doesn't have a public API available yet, but notion-py, a python client for Notion's private API, enables connection. I hooked up the client to a Flask app, and created several REST API endpoints for the front end to consume, as well as an index route for a single page React application. I also built a simple timed cache to avoid unnecesarry requests to Notion. The cache is set to the table state when the server starts, and saves a TTL (Set to 1 week in this case). Most portfolio websites are not receiving updates more often than this, but in cases where synced state is important, the cache can be switched off easily. Notion-py has a built in caching mechanism itself that can be enabled, but I found it to be less effective as it caches user information as well. Some simple tests indicated that the timed cache completed requests about 30% faster on average. I'll consider refactoring it into a class if I find different needs for it. 

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