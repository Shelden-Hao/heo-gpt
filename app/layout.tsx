import type {Metadata} from "next";
import "../styles/globals.css";
import AppContextProvider from "@/components/AppContext";
import EventBusContextProvider from "@/components/EventBusContext";
import React from "react";

export const metadata: Metadata = {
  title: "XIU-GPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body suppressHydrationWarning={true}>
       <AppContextProvider>
           <EventBusContextProvider>
               {children}
           </EventBusContextProvider>
       </AppContextProvider>
      </body>
    </html>
  );
}
