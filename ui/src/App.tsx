import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import { Callback } from './pages/Callback';
import { AppShell } from './pages/AppShell';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Chats } from './pages/AppShell/pages/Chats';
import { Files } from './pages/AppShell/pages/Files';
import { Settings } from './pages/AppShell/pages/Settings';
import { Home } from './pages/AppShell/pages/Home';

const queryClient = new QueryClient()

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<><Outlet /></>} >
    <Route path="/" element={<AppShell />}>
      <Route path='/home' element={<Home />} />
      <Route path="/chats/:chatId" element={<Chats />} />
      <Route path="/files" element={<Files />} />
      <Route path='/settings' element={<Settings />} />
    </Route>
    <Route path="/callback" element={<Callback />} />,
  </Route>,
));


function App() {
  return <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>;
}

export default App
