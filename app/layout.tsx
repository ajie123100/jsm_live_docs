import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

import './globals.css'
import { Metadata } from "next"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { dark } from "@clerk/themes"
import Provider from "./Provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'LiveDocs',
  description: 'Your go-to collaborative editor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ClerkProvider
    // 解释: 用于提供 Clerk 的上下文
    // 用法: 用于提供 Clerk 的上下文
    // 详细: https://docs.clerk.dev/reference/clerk-provider
    <ClerkProvider
    // appearance
    // 解释: 用于配置 Clerk 的外观
    // 用法: 用于配置 Clerk 的外观
    // 详细: https://docs.clerk.dev/reference/clerk-provider#appearance
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#3371FF',
          fontSize: '16px',
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}