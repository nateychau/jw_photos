# config.py
import os 

NOTION_TOKEN = os.environ.get('NOTION_TOKEN')
TABLE_KEY = os.environ.get('TABLE_KEY')
ABOUT_KEY = os.environ.get('ABOUT_KEY')

assert NOTION_TOKEN
assert TABLE_KEY
assert ABOUT_KEY
