from fastapi import APIRouter, Request, Body, status, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models import UserBase, LoginBase, CurrentUser

from auth import Authorization

router = APIRouter()

auth_handler = Authorization()


@router.post("/register", response_description="Register Users")
async def register(
    request: Request, newUser: UserBase = Body(...)
                   ) -> str:

    newUser.password = auth_handler.get_password_hash(newUser.password)
    newUser = jsonable_encoder(newUser)

    if (
        existing_email := await request.app.mongodb["users"].find_one(
            {"email": newUser["email"]}
        )
        is not None
    ):
        raise HTTPException(
            status_code=409,
            detail=f"User with email {existing_email} already exists"
        )

    user = await request.app.mongodb["users"].insert_one(newUser)
    created_user = await request.app.mongodb["users"].find_one(
        {"_id": user.inserted_id}
    )

    return JSONResponse(
        status_code=status.HTTP_201_CREATED, content=created_user
        )


@router.post("/login", response_description="Login Users")
async def login(request: Request, loginUser: LoginBase = Body(...)) -> str:
    user = await request.app.mongodb["users"].find_one(
        {"username": loginUser.username}
    )

    if (user is None) or (
        not auth_handler.verify_password(loginUser.password, user["password"])
    ):
        raise HTTPException(
            status_code=401, detail="Invalid username and/or password"
            )
    token = auth_handler.encode_token(user["_id"])
    response = JSONResponse(content={"token": token})

    return response


@router.get("/me", response_description="Logged in user data")
async def me(request: Request, userId=Depends(auth_handler.auth_wrapper)):
    currentUser = await request.app.mongodb["users"].find_one({"_id": userId})
    result = CurrentUser(**currentUser).dict()
    result["id"] = userId

    return JSONResponse(status_code=status.HTTP_200_OK, content=result)
