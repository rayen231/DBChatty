// App.tsx
import { Routes, Route } from "react-router-dom";
import SideBar from "./compo/SideBar";
import Library from "./compo/Library";
import ChatBot from "./compo/ChatBot";
import Welcome from "./compo/Welcome";
import { ChatProvider } from "./compo/ChatContext";

const backendUrl = "http://127.0.0.1:8000";

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col min-h-screen">
        <SideBar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/compo/library"
            element={<Library backendUrl={backendUrl} />}
          />
          <Route
            path="/compo/chatbot"
            element={<ChatBot backendUrl={backendUrl} />}
          />
        </Routes>
      </div>
    </ChatProvider>
  );
}

export default App;
