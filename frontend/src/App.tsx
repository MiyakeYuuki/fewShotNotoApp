import Chat from "./pages/Chat/Chat";
import { ChatProvider } from "./pages/Chat/ChatProvider";

const App = () => {
    return (
        <ChatProvider>
            <Chat />
        </ChatProvider>
    );
};

export default App;