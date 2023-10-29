from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Image(Base):
    __tablename__ = 'banana_image'

    filename = Column(String(255), primary_key=True)
    treeID = Column(Integer)
    diagnosis = Column(String(255))
    author = Column(String(255))
    part = Column(String(255))  
    status = Column(String(255))
    location = Column(String(255))

    def __init__(self, filename, treeID, diagnosis, author, part, status, location):
        self.filename = filename
        self.treeID = treeID
        self.diagnosis = diagnosis
        self.author = author
        self.part = part
        self.status = status
        self.location = location

    def __repr__(self):
        return f"<Image(filename='{self.filename}')>"