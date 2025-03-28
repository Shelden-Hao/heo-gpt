"use client";
import Menubar from "@/components/home/Navigation/Menubar";
import {useAppContext} from "@/components/AppContext";
import Toolbar from "@/components/home/Navigation/Toolbar";
import ChatList from "@/components/home/Navigation/ChatList";

export default function Navigation() {
    const {state: {displayNavigation}} = useAppContext()
    return (
        <nav className={`${displayNavigation ? "" : "hidden"} flex flex-col h-full w-[260px] border-r-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 p-2 relative`}>
            <Menubar/>
            <ChatList />
            <Toolbar />
        </nav>
    );
}
