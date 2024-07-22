from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from pydantic import BaseModel
from auth.require_auth import AuthorizedUserClaims, authorizer
import access_limits
import repository.chat_repository as repository
from fastapi.openapi.utils import get_openapi

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Chat(BaseModel):
    user_id: str
    chat_id: str
    messages: list[repository.ChatMessage]

@app.post("/api/v1/chats/", responses={401: {"description": "Unauthorized or limited access"}}, tags=["chats"])
def create_chat(
    user_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)],
) -> Chat:
    access_limits.create_chat(user_claims)
    chat_id = uuid4()
    chat = Chat(user_id=user_claims.user_id, chat_id=chat_id.__str__(), messages=[])
    repository.insert_chat(chat)
    return chat

@app.get("/api/v1/chats", responses={401: {"description": "Unauthorized or limited access"}}, tags=["chats"])
def list_chats(auth_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)]) -> list[Chat]:
    return repository.get_chats_for_user(auth_claims.user_id)

@app.get("/api/v1/chats/{chat_id}", responses={401: {"description": "Unauthorized or limited access"}}, tags=["chats"])
def get_chat(chat_id: str, auth_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)]) -> Chat:
    chat = repository.query_chat(chat_id)
    if chat is None:
        raise HTTPException(
            detail="chat.not_found", status_code=status.HTTP_404_NOT_FOUND
        )
    if chat.user_id != auth_claims.user_id:
        raise HTTPException(
            detail="auth.unauthorized", status_code=status.HTTP_401_UNAUTHORIZED
        )
    return chat

@app.delete("/api/v1/chats/{chat_id}", responses={401: {"description": "Unauthorized or limited access"}}, tags=["chats"])
def delete_chat(chat_id: str, auth_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)]) -> str:
    chat = repository.query_chat(chat_id)
    if chat is None:
        raise HTTPException(
            detail="chat.not_found", status_code=status.HTTP_404_NOT_FOUND
        )
    if chat.user_id != auth_claims.user_id:
        raise HTTPException(
            detail="auth.unauthorized", status_code=status.HTTP_401_UNAUTHORIZED
        )
    repository.delete_chat(chat_id)
    return "Chat deleted"

@app.post("/api/v1/chats/{chat_id}/messages/", responses={401: {"description": "Unauthorized or limited access"}}, tags=["messages"])
def add_message(
    user_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)],
    chat_id: str,
    message: repository.ChatMessage,
) -> str:
    chat = repository.query_chat(chat_id)
    if chat is None:
        raise HTTPException(
            detail="chat.not_found", status_code=status.HTTP_404_NOT_FOUND
        )
    if (
        chat.user_id == user_claims.user_id
    ):
        access_limits.add_message(chat_id, user_claims)
        repository.insert_message(chat_id, message)
        return "Message added"
    else:
        raise HTTPException(
            detail="auth.unauthorized", status_code=status.HTTP_401_UNAUTHORIZED
        )

@app.get("/api/v1/chats/{chat_id}/messages/", responses={401: {"description": "Unauthorized or limited access"}}, tags=["messages"])
def list_messages(chat_id: str, auth_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)]) -> list[repository.ChatMessage]:
    chat = repository.query_chat(chat_id)
    if chat is not None and chat.user_id != auth_claims.user_id:
        raise HTTPException(
            detail="auth.unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)
    if chat is None:
        raise HTTPException(
            detail="chat.not_found", status_code=status.HTTP_404_NOT_FOUND
        )
    else:
        return chat.messages

@app.get("/api/v1/chats/{chat_id}/messages/{message_id}", responses={401: {"description": "Unauthorized or limited access"}},tags=["messages"])
def get_message(chat_id: str, message_id: str, auth_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)]) -> repository.ChatMessage:
    chat = repository.query_chat(chat_id=chat_id)
    if chat is None:
        raise HTTPException(
            detail="chat.not_found", status_code=status.HTTP_404_NOT_FOUND
        )
    if chat.user_id != auth_claims.user_id:
        raise HTTPException(
            detail="auth.unauthorized", status_code=status.HTTP_401_UNAUTHORIZED
        )
    repository.get_message(chat_id=chat_id, message_id=message_id)
    raise HTTPException(
        detail="message.not_found", status_code=status.HTTP_404_NOT_FOUND
    )

@app.put("/api/v1/chats/{chat_id}/messages/{message_id}/content", responses={401: {"description": "Unauthorized or limited access"}},tags=["messages"])
def update_message_content(chat_id: str, message_id: str, content: str, auth_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)]) -> str:
    chat = repository.query_chat(chat_id=chat_id)
    if chat is None:
        raise HTTPException(
            detail="chat.not_found", status_code=status.HTTP_404_NOT_FOUND
        )
    if chat.user_id != auth_claims.user_id:
        raise HTTPException(
            detail="auth.unauthorized", status_code=status.HTTP_401_UNAUTHORIZED
        )
    repository.update_message_content(chat_id=chat_id, message_id=message_id, content=content)
    raise HTTPException(
        detail="message.not_found",status_code=status.HTTP_404_NOT_FOUND
    )

@app.delete("/api/v1/chats/{chat_id}/messages/{message_id}", responses={401: {"description": "Unauthorized or limited access"}},tags=["messages"])
def delete_message(chat_id: str, message_id: str, auth_claims: Annotated[AuthorizedUserClaims, Depends(authorizer)]) -> str:
    chat = repository.query_chat(chat_id = chat_id)
    if chat is None:
        raise HTTPException(
            detail="chat.not_found", status_code=status.HTTP_404_NOT_FOUND
        )
    if chat.user_id != auth_claims.user_id:
        raise HTTPException(
            detail="auth.unauthorized", status_code=status.HTTP_401_UNAUTHORIZED
        )
    repository.delete_messages(chat_id=chat_id, message_ids=[message_id])
    raise HTTPException(
        detail="message.not_found", status_code=status.HTTP_404_NOT_FOUND
    )

def langchat_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="LangChat API",
        version="0.0.1",
        summary="API for LangChat",
        description="This is the API for LangChat, a chat application to demonstrate the usage of Novu platform's In-App notification provider with React SPAs for realtime chat",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = langchat_openapi