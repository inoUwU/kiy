import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/features/chat-sidebar/chat-sidebar";
import "./App.css";

import { BranchingChatApp } from "@/features/branching-chat/branching-chat-app";

// TODO ここに画面の機能を追加してく

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <BranchingChatApp />
      </main>
    </SidebarProvider>
  );
}
export default App;
