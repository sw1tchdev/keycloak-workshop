from keycloak import KeycloakOpenID, KeycloakAdmin
from typing import Annotated
from fastapi import FastAPI, Header, HTTPException, Depends, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request

keycloak_openid = KeycloakOpenID(server_url="http://localhost:20090",
                                 client_id="backend",
                                 realm_name="workshop",
                                 client_secret_key="client_secret_here")

admin = KeycloakAdmin(
    server_url="http://localhost:20090",
    client_id="backend",
    realm_name="workshop",
    client_secret_key="client_secret_here",
    auto_refresh_token=['get', 'put', 'post', 'delete'])

KEYCLOAK_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\n" + keycloak_openid.public_key() + "\n-----END PUBLIC KEY-----"

map_sids = []
notBefore = {'time': 0}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def verify_token(request: Request, authorization: Annotated[str, Header()]):
    if not authorization.startswith('Bearer'):
        raise HTTPException(status_code=401, detail="Unauthorization")
    options = {"verify_signature": True, "verify_aud": True, "verify_exp": True}
    [_, token] = authorization.split('Bearer ')
    try:
        token_info = keycloak_openid.decode_token(token, key=KEYCLOAK_PUBLIC_KEY, options=options)
        request.state.user = token_info

        if map_sids.count(token_info['sid']) == 0:
            map_sids.append(token_info['sid'])
    except Exception as exception:
        raise HTTPException(status_code=401, detail=str(exception))
    # TODO implement check not before


@app.get("/user/me", dependencies=[Depends(verify_token)])
async def get_user_id(request: Request):
    return {"sub": request.state.user['sub'], "sid": request.state.user['sid']}


@app.get("/user/me/extend", dependencies=[Depends(verify_token)])
async def get_user_profile(request: Request):
    return {"user": admin.get_user(request.state.user['sub'])}


@app.post("/logout")
async def logout(logout_token: Annotated[str, Form()]):
    logout_token_info = keycloak_openid.decode_token(logout_token, key=KEYCLOAK_PUBLIC_KEY,
                                                     options={"verify_signature": True,
                                                              "verify_aud": False,
                                                              "verify_exp": True})
    if not map_sids.count(logout_token_info['sid']) == 0:
        map_sids.remove(logout_token_info['sid'])
    return 'ok'


@app.post("/admin/k_push_not_before")
async def admin_push_not_before(body: str = Body(..., media_type='text/plain')):
    push_not_before_token_info = keycloak_openid.decode_token(body, key=KEYCLOAK_PUBLIC_KEY,
                                                              options={"verify_signature": True,
                                                                       "verify_aud": False,
                                                                       "verify_exp": True})
    # TODO save notBefore
    return 'ok'


@app.post("/admin/k_logout")
async def admin_logout(body: str = Body(..., media_type='text/plain')):
    logout_token_info = keycloak_openid.decode_token(body, key=KEYCLOAK_PUBLIC_KEY,
                                                     options={"verify_signature": True,
                                                              "verify_aud": False,
                                                              "verify_exp": True})
    # TODO save notBefore
    return 'ok'


@app.get("/health")
def health_check():
    return {"STATUS": "OK"}
