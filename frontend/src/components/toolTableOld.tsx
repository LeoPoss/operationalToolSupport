import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useTools } from '@/lib/actions'
import type { Tool } from '@/lib/types'
import { DotsThree } from '@phosphor-icons/react'

const ToolRow = ({ tool }: { tool: Tool }) => {
	const badgeVariant = tool.status === 'AVAILABLE' ? 'default' : 'destructive'

	return (
		<TableRow>
			<TableCell className="font-medium">
				<code>{tool.externalId}</code>
			</TableCell>
			<TableCell>
				<div className="flex flex-col">
					<span className="font-medium">{tool.brand}</span>
					<span>
						{tool.type} - {tool.model}
					</span>
				</div>
			</TableCell>
			<TableCell>{tool.name}</TableCell>
			<TableCell>
				<Badge variant={badgeVariant}>{tool.status}</Badge>
			</TableCell>
			<TableCell className="justify-end flex p-4">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<DotsThree size={24} />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	)
}

export const ToolTableOld = () => {
	const { data: tools, error } = useTools()

	if (error) {
		return <div>Error loading tools.</div>
	}

	if (!tools) {
		return (
			<div className="flex flex-col p-4">
				<span className="font-medium">Currently no tools</span>
				<span className="text-sm text-muted-foreground">
					Start with adding tools
				</span>
			</div>
		)
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Brand</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{tools.map((tool) => (
					<ToolRow key={tool.externalId} tool={tool} />
				))}
			</TableBody>
		</Table>
	)
}
