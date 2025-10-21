import '@/styles/globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { NavBar } from './_components/NavBar';
import App from '@/pages.old/_app';
import { AppSideBar } from './_components/AppSideBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppSideBar />
          <main className="w-full">
            <NavBar />
            <div className="px-4">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
