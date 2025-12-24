import "./globals.css";

export const metadata = {
  title: "Candidate Ranking System",
  description: "Advanced candidate filtering and ranking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
