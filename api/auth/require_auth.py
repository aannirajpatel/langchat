from enum import Enum
from typing import Annotated
from urllib.request import Request
from fastapi import Depends, HTTPException
import json
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import status
from pydantic import BaseModel
import six
from jose import jwt

urlopen = six.moves.urllib.request.urlopen

class AuthorizerVersion(Enum):
    V1 = 'V1'

class AuthorizedUserClaims(BaseModel):
    user_id: str
    scopes: list[str]
    version: AuthorizerVersion

def authorizer(bearerCredentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())]) -> AuthorizedUserClaims:
    token = bearerCredentials.credentials
    # jwks_uri endpoint retrieved from Logto
    jwks_uri = urlopen(Request('https://ukd7y2.logto.app/oidc/jwks', headers={'User-Agent': 'Mozilla/5.0'}))
    # issuer retrieved from Logto
    issuer = 'https://ukd7y2.logto.app/oidc'

    jwks = json.loads(jwks_uri.read())

    try:
      payload = jwt.decode(
        token,
        jwks,
        # The jwt encode algorithm retrieved along with jwks. ES384 by default
        algorithms=jwt.get_unverified_header(token).get('alg'),
        # The API's registered resource indicator in Logto
        audience='https://langchat.aanpatel.tech/api',
        issuer=issuer,
        options={
          'verify_at_hash': False
        }
      )

    except Exception:
      # exception handler
      raise HTTPException(detail='auth.invalid_token', status_code=status.HTTP_401_UNAUTHORIZED)
      # Custom code to process payload
    return AuthorizedUserClaims(user_id=payload.get('sub'), scopes=str(payload.get('scope')).split(" "), version=AuthorizerVersion.V1)

