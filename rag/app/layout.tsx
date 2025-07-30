import "./global.css";
export const metadata = {
  title: "RAG",
  description: "OpenAi Next.js",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
