import type {Metadata} from "next";
import "../styles/globals.css";
import AppContextProvider from "@/components/AppContext";
import EventBusContextProvider from "@/components/EventBusContext";

export const metadata: Metadata = {
  title: "XIU-GPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
       <AppContextProvider>
           <EventBusContextProvider>
               {children}
           </EventBusContextProvider>
       </AppContextProvider>
      </body>
    </html>
  );
}
