import Menu from "@/components/home/Main/Menu";
import Welcome from "@/components/home/Main/Welcome";
import ChatInput from "@/components/home/Main/ChatInput";

export default function Navigation() {
    return (
        <div className={"flex-1 relative"}>
            <main className={`overflow-y-auto relative w-full h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100`}>
                <Menu/>
                <Welcome />
                <ChatInput />
            </main>
        </div>
    );
}
