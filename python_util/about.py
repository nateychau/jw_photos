class About: 
    def __init__(self, page_block):
        self.title = "About"
        self._page_block = page_block
        self._sync_with_record()


    def to_dict(self):
        return {
          "title": self.title,
          "image": self.image,
          "text": self.text
        }


    def refresh(self):
      self._page_block.refresh()
      self._sync_with_record()


    #sync page attributes with record object 
    #first image block found will always be set as the page's image
    #!!!need to add protection against bad blocks
    def _sync_with_record(self):
        children = self._page_block.children 
        self.image = ""
        self.text = []
        for child in children:
            if child.type == "image":
                self.image = child.source
            elif child.type == "text" and len(child.title):
                self.text.append(child.title)
