import { useHandleSignInCallback } from '@logto/react';
import { useNavigate } from 'react-router-dom';
export const Callback = () => {
    const navigate = useNavigate();
    const { isLoading } = useHandleSignInCallback(() => {
        // Navigate to root path when finished
        console.log('Login success!');
        navigate('/home');
    });

    // When it's working in progress
    if (isLoading) {
        return <div>Redirecting...</div>;
    }

    return null;
};