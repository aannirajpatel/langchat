import { CommentOutlined, FileOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Layout, Menu, theme, Typography } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import * as DefaultClient from '../../client';
import { MenuItem } from '../../common/MenuItem';
import { useAppContext } from '../../hooks/useAppContext';
import { useMenuNav } from '../../hooks/useMenuNav';

const { Header, Content, Footer, Sider } = Layout;

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

export const AppShell = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { user, accessToken, signIn, signOut } = useAppContext();
    useEffect(() => {
        console.log(user);
        console.log(accessToken);
    }, [accessToken, user]);

    const { data: chatList } = useQuery({
        queryKey: ['user_chats'],
        queryFn: async () => {
            return await DefaultClient.listChatsApiV1ChatsGet();
        },
        enabled: !!accessToken
    });



    const items: MenuItem[] = [
        getItem('Home', 'home', <HomeOutlined />),
        getItem('User Settings', 'settings', <UserOutlined />),
        getItem('Chats', 'chats', <CommentOutlined />, [
            ...(chatList ? chatList.map((chatItem) => {
                if (chatItem.messages.length >= 1) {
                    return getItem(chatItem.messages[0].content.slice(0, 10) + '...', chatItem.chat_id);
                } else {
                    return getItem('Untitled Chat', chatItem.chat_id);
                }
            }) : [])
        ]),
        getItem('Files', 'files', <FileOutlined />),
    ];

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.pathname.slice(1).split('/')[0]) {
            navigate('/home');
        }
    }, [location.pathname, navigate]);

    const { onNavigate } = useMenuNav();
    
    const deriveSelectedKeysFromLocation = (): string[] => {
        return location.pathname.slice(1).split('/').reverse();
    }
    return (
        <Layout hasSider>
            <Sider
                style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
            >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']} selectedKeys={deriveSelectedKeysFromLocation()} items={items} onSelect={(x) => { console.log("blah", x); onNavigate(x.keyPath) }} />
            </Sider>
            <Layout style={{ marginLeft: 200 }}>
                <Header style={{ padding: 16, background: colorBgContainer, display: 'flex' }} >
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <Typography.Title level={1} style={{ margin: 0 }}>LangChat</Typography.Title>
                        {accessToken ? <Button type="primary" onClick={signOut}>Sign out</Button> :
                            <Button type="primary" onClick={signIn}>Sign in</Button>}
                    </Flex>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div
                        style={{
                            padding: 24,
                            textAlign: 'center',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Aan Patel ©{new Date().getFullYear()} Created by Aan Patel
                </Footer>
            </Layout>
        </Layout>
    );


};