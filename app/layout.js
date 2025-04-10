import "../styles/globals.css";
export const metadata = {
  title: "Rick and Morty",
  description: "Primeiro consumo de Api com Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
