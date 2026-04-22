export const metadata = {
  title: 'Voxa Roadmap',
  description: 'Voxa Technical Build Roadmap',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
