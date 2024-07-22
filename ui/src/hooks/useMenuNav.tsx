import { useNavigate } from "react-router-dom";
import { useAppContext } from "./useAppContext";

export function useMenuNav(){
    const {signOut} = useAppContext();
    const nav = useNavigate();
    return {
        onNavigate: (selectedKeys: string[]) => {
            console.log("in onNavigate",selectedKeys);
            if(selectedKeys.length === 0) return;
            switch (selectedKeys[selectedKeys.length-1]) {
                case 'settings':
                    nav('/settings');
                    break;
                case 'chats':
                    if (selectedKeys.length < 2) return;
                    nav(`/chats/${selectedKeys[0]}`);
                    break;
                case 'files':
                    nav('/files');
                    break;
                case 'home':
                    nav('/home');
                    break;
                case 'logout':
                    signOut();
                    break;
                default:
                    break;
            }
        }
    }
}