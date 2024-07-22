import { IdTokenClaims, useLogto } from '@logto/react';
import { useEffect, useState } from 'react';
import * as DefaultClient from '../client';

const signOutRedirect = 'http://localhost:5173/';
const signInCallbackUrl = 'http://localhost:5173/callback';
export const useAppContext = ()=>{
    const { signIn, signOut, isAuthenticated, getIdTokenClaims, getAccessToken } = useLogto();
    const [accessToken, setAccessToken] = useState<string>('');

    const [user, setUser] = useState<IdTokenClaims>({} as IdTokenClaims);

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const claims = await getIdTokenClaims() as IdTokenClaims;
                setUser(claims);
                try {
                    const token = await getAccessToken('https://langchat.aanpatel.tech/api') as string;
                    setAccessToken(token);
                    DefaultClient.OpenAPI.TOKEN = token;
                    DefaultClient.OpenAPI.BASE = "http://localhost:8000";
                } catch (error) {
                    console.error(error);
                }
            }
        })();
    }, [getIdTokenClaims, isAuthenticated, getAccessToken]);
    return {signIn:()=>signIn(signInCallbackUrl), signOut:()=>signOut(signOutRedirect), isAuthenticated, user, accessToken};
}
