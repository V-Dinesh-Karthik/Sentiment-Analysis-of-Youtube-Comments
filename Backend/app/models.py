# from bson import ObjectId
# from typing import Annotated, Union
from pydantic import EmailStr, Field, BaseModel, validator
# from pydantic.functional_validators import AfterValidator
import uuid
# from pydantic_core import CoreSchema
from email_validator import validate_email, EmailNotValidError

'''
class PyObjectId(ObjectId):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls):
        return {"type": "string"}

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
       field_schema.update(type="string")
'''


class MongoBaseModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")

    class Config:
        # json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True


class UserBase(MongoBaseModel):
    username: str = Field(..., min_length=2)
    email: str = Field(...)
    password: str = Field(...)

    @validator("email")
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError as e:
            raise e


class LoginBase(BaseModel):
    username: str = Field(...)
    password: str = Field(...)


class CurrentUser(BaseModel):
    email: str = EmailStr()
    username: str = Field(...)


class LinkBody(BaseModel):
    url: str = Field(...)


class AnalyzeBody(BaseModel):
    data: list = Field(...)
