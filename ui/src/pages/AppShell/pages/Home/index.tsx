import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as DefaultClient from '../../../../client';
import { Button } from "antd";
import { useAppContext } from "../../../../hooks/useAppContext";
export function Home() {
    const {accessToken} = useAppContext();
    const q = useQueryClient();
    const { isPending, mutate } = useMutation({
        mutationKey: ['create_chat'],
        mutationFn: async () => {
            await DefaultClient.createChatApiV1ChatsPost();
            q.invalidateQueries({
                queryKey: ['user_chats']
            });
        },
    });
    return <div>
        <h1>
            Click on a chat conversation, or create one to get started!
        </h1>
        <Button loading={isPending} disabled={!accessToken} onClick={() => { mutate() }} type="primary">Create Chat</Button>
    </div>
}