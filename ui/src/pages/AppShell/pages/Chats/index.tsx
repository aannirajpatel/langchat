import { useParams } from "react-router-dom";
import { useChat } from "./useChat";
// import { HeadlessService, FetchResult, ISession, IMessage } from '@novu/headless';
import { PlusSquareOutlined } from "@ant-design/icons";
import {
    ChatContainer,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import { Button, Flex } from "antd";

export const Chats = () => {
    const { chatId } = useParams();
    const { messages: currentMessages, sendMessage, draft, setDraft, createChat, creatingChat } = useChat(chatId);
    const aiIsTyping = currentMessages.length > 0 && currentMessages[currentMessages.length - 1].role === "user";
    return (
        <Flex vertical align="flex-start" gap={8}>
            <Button icon={<PlusSquareOutlined />} loading={creatingChat} onClick={() => { createChat() }}>Start a new chat</Button>
            <MainContainer style={{ width: '100%' }}>
                <ChatContainer style={{ height: "100%" }}>
                    <MessageList style={{ height: '100%' }} typingIndicator={aiIsTyping && <TypingIndicator content="AI is typing" />}>
                        {currentMessages.map(m =>
                            <Message key={m.id} model={{
                                type: "text",
                                payload: m.content,
                                direction: m.role === "user" ? "outgoing" : "incoming",
                                position: "normal",
                                sentTime: m.timestamp as string,
                            }} />
                        )}
                    </MessageList>
                    <MessageInput sendDisabled={aiIsTyping} attachDisabled onSend={() => { sendMessage() }} value={draft} onChange={(v) => setDraft(v)} placeholder="Type a message" />
                </ChatContainer>
            </MainContainer>
        </Flex>
    );
}
