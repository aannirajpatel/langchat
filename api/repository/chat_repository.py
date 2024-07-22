from datetime import datetime, UTC
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    content: str
    role: str
    id: str
    timestamp: datetime | None = Field(default=None)

class Chat(BaseModel):
    user_id: str
    chat_id: str
    messages: list[ChatMessage]

chats_collection: dict[str,Chat] = dict()

def insert_chat(chat: Chat) -> None:
    chats_collection[chat.chat_id] = chat

def query_chat(chat_id:str) -> Chat | None:
    if chat_id in chats_collection:
        return chats_collection[chat_id]
    return None

def delete_chat(chat_id:str) -> None:
    if chat_id in chats_collection:
        chats_collection.pop(chat_id)
    else:
        raise Exception('Chat not found')

def insert_message(chat_id:str, message: ChatMessage) -> None:
    if chat_id in chats_collection:
        message.timestamp = datetime.now(UTC)
        chats_collection[chat_id].messages.append(message)
    else:
        raise Exception('Chat not found')

def get_message(chat_id:str, message_id: str) -> ChatMessage:
    if chat_id in chats_collection:
        for chat_message in chats_collection[chat_id].messages:
            if chat_message.id == message_id:
                return chat_message
        raise Exception('Message not found')
    raise Exception('Chat not found')

def update_message_content(chat_id:str, message_id: str, content: str) -> None:
    if chat_id in chats_collection:
        for chat_message in chats_collection[chat_id].messages:
            if chat_message.id == message_id:
                chat_message.content = content
                return
        raise Exception('Message not found')
    else:
        raise Exception('Chat not found')

def delete_messages(chat_id:str, message_ids: list[str]) -> None:
    if chat_id in chats_collection:
        for chat_message in chats_collection[chat_id].messages:
            if chat_message.id == message_ids:
                chats_collection[chat_id].messages.remove(chat_message)
                return
        raise Exception('Message not found')
    else:
        raise Exception('Chat not found')

def get_chats_count(user_id: str) -> int:
    return len([chat for chat in chats_collection.values() if chat.user_id == user_id])

def get_messages_count(chat_id: str) -> int:
    if chat_id in chats_collection:
        return len(chats_collection[chat_id].messages)
    return 0

def get_chats_for_user(user_id: str) -> list[Chat]:
    return [chat for chat in chats_collection.values() if chat.user_id == user_id]