import src.entities.entity
from sqlalchemy import Column, String, Integer
from marshmallow import Schema, fields
from flask_login import UserMixin
import hashlib


class User(UserMixin, src.entities.entity.Entity, src.entities.entity.Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    password_hash = Column(String)
    email_address = Column(String)

    def set_password(self, password):
        self.password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

    def check_password(self, password):
        return self.password_hash == hashlib.sha256(password.encode('utf-8')).hexdigest()


class UserSchema(Schema):
    id = fields.Integer()
    username = fields.String()
    password = fields.String()
    email_address = fields.String()

class SecureUser():
    id = 0
    username = ''
    password = ''
    email_address = ''
    def __init__(self, user : User):
        self.id = user.id
        self.username = user.username
        self.password = ''
        self.email_address = user.email_address