from auth.require_auth import AuthorizedUserClaims
from repository.chat_repository import get_chats_for_user, get_messages_count


from fastapi import HTTPException, status


def create_chat(auth_claims: AuthorizedUserClaims) -> None:
    if (
        len(auth_claims.scopes) == 0 or "langchat:chat.full" not in auth_claims.scopes
    ) and len(get_chats_for_user(auth_claims.user_id)) >= 1:
        print(auth_claims)
        raise HTTPException(
            detail="auth.limited_access", status_code=status.HTTP_401_UNAUTHORIZED
        )


def add_message(chat_id: str, auth_claims: AuthorizedUserClaims):
    if (
            len(auth_claims.scopes) == 0 or "langchat:chat.full" not in auth_claims.scopes
        ) and get_messages_count(chat_id) >= 4:
        raise HTTPException(
                detail="auth.limited_access", status_code=status.HTTP_401_UNAUTHORIZED
            )