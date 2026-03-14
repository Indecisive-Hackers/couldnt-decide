from sqlalchemy import create_engine, Column, Integer
import sqlalchemy.orm
import sqlalchemy.ext.declarative
import os

db_url = 'localhost:5432'
db_name = 'cant-decide'
db_user = 'postgres'
db_password = 'cat'
engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_url}/{db_name}')
Session = sqlalchemy.orm.sessionmaker(bind=engine)
Base = sqlalchemy.ext.declarative.declarative_base()


class Entity:
    id = Column(Integer, primary_key=True)

    def __init__(self):
        pass
