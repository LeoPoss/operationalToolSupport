import { Wrench } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
	return (
		<nav className="backdrop-blur p-4 sticky top-0 col-start-1 row-start-1">
			<div className="container mx-auto flex justify-between items-center">
				<div className="font-bold text-lg">
					<Link href="/" className="flex flex-inline">
						<Wrench className="mr-2" /> ToolConnect (The Operational Perspective
						of BPM)
					</Link>
				</div>
				<div className="flex space-x-4">
					<Link href="/" className="text-gray-500 hover:text-black">
						Home
					</Link>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
