import { useAppContext } from "../../../../hooks/useAppContext";
// import { HeadlessService, FetchResult, ISession, IMessage } from '@novu/headless';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as DefaultClient from '../../../../client';
import { useState } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

// const headlessService = new HeadlessService({
//     applicationIdentifier: "APP_ID_FROM_ADMIN_PANEL",
//     subscriberId: "USER_ID",
//     subscriberHash: "HASHED_SUBSCRIBER_ID",
// });

export const useChat = (chatId?: string) => {
    const navigate = useNavigate();

    const { accessToken } = useAppContext();
    // Message input value
    const [draft, setDraft] = useState("");

    // headlessService.listenNotificationReceive({
    //     listener: (message: IMessage) => {
    //         console.log(JSON.stringify(message));
    //     },
    // });

    const queryClient = useQueryClient();

    const { data: retrievedChat, isLoading: isLoadingMessages, isError, isRefetching: isRefetchingMessages } = useQuery({
        queryKey: ["chats", chatId ?? "chatIdNotDefined"], queryFn: async () => {
            return await DefaultClient.getChatApiV1ChatsChatIdGet({
                chatId: chatId!,
            })
        },
        enabled: !!chatId && !!accessToken,
    });

    const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
        mutationKey: ["sendChatMessage"],
        mutationFn: async () => {
            if (accessToken && !!chatId) {
                return await DefaultClient.addMessageApiV1ChatsChatIdMessagesPost({
                    chatId: chatId,
                    requestBody: {
                        content: draft,
                        role: "user",
                        id: nanoid(),
                    }
                });
            }
        },
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["chats", chatId]
                });
            }, 1000);
            setDraft("");
        },
        onError: (error) => {
            if( error instanceof AxiosError){
                console.log("yoyoy",error);
                error.status === 401 && navigate('/login');
            }
        }
    });

    const {mutate: createChat, isPending: creatingChat} = useMutation({
        mutationKey: ["create_chat"],
        mutationFn: async ():Promise<string> => {
            const x = await DefaultClient.createChatApiV1ChatsPost();
            queryClient.invalidateQueries({
                queryKey: ['user_chats']
            });
            return x.chat_id;
        },
        onSuccess: (chat_id) => {
            navigate('/chats/' + chat_id);
        }
    });

    return {
        messages: retrievedChat?.messages || [],
        isLoading: isLoadingMessages || isRefetchingMessages || isSendingMessage,
        isError: isError,
        sendMessage,
        draft,
        setDraft,
        createChat,
        creatingChat,
    }

}