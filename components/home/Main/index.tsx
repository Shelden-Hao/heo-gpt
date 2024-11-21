import Menu from "@/components/home/Main/Menu";

export default function Navigation() {
    return (
        <nav className={`relative flex-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100`}>
            <Menu/>
        </nav>
    );
}
