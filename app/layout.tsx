import type {Metadata} from "next";
import "../styles/globals.css";
import AppContextProvider from "@/components/AppContext";

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
      <body>
       <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
