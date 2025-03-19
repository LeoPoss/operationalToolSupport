'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/app/navbar'
import BlurryBlob from '@/components/ui/blurry-blob'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Link from 'next/link'
import type React from 'react'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<QueryClientProvider client={queryClient}>
					<Toaster />
					<div className="relative flex flex-col min-h-screen overflow-hidden">
						<div className="absolute top-5 right-[-5%] w-[40%] h-[60%] -z-10 pointer-events-none">
							<BlurryBlob />
						</div>
						<Navbar />
						<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
							{children}
						</main>
						<footer className="w-full flex items-center justify-center py-3">
							<Link
								className="flex items-center gap-1 text-current"
								href="https://go.ur.de/iot"
							>
								<span className="text-default-600 text-sm">Leo Poss, University of Regensburg • 2024</span>
							</Link>
						</footer>
					</div>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</body>
		</html>
	)
}
