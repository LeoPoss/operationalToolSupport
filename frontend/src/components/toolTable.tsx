import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useTools } from '@/lib/actions'
import type { Tool } from '@/lib/types'
import { ArrowsDownUp } from '@phosphor-icons/react'
import type { ColumnDef } from '@tanstack/table-core'

export const ToolTable = () => {
	const { data: tools, error } = useTools()

	const columns: ColumnDef<Tool>[] = [
		{
			accessorKey: 'externalId',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						ID
						<ArrowsDownUp size={16} className="ml-2" weight="duotone" />
					</Button>
				)
			},
			cell: ({ row }) => {
				return <code>{row.getValue('externalId')}</code>
			},
		},
		{
			accessorKey: 'brand',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Tool
						<ArrowsDownUp size={16} className="ml-2" weight="duotone" />
					</Button>
				)
			},
			cell: ({ row }) => {
				return (
					<div className="flex flex-col">
						<span className="font-medium">{row.original.brand}</span>
						<span>
							{row.original.type} - {row.original.model}
						</span>
					</div>
				)
			},
		},
		/*{
			accessorKey: 'name',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Name
						<ArrowsDownUp size={16} className="ml-2" weight="duotone" />
					</Button>
				)
			},
		},*/
		{
			accessorKey: 'status',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						State
						<ArrowsDownUp size={16} className="ml-2" weight="duotone" />
					</Button>
				)
			},
			cell: ({ row }) => {
				return (
					<Badge
						variant={
							row.getValue('status') === 'AVAILABLE' ? 'default' : 'destructive'
						}
					>
						{row.getValue('status')}
					</Badge>
				)
			},
		},
	]

	if (!tools) {
		return <div>No tools</div>
	}

	return (
		<div className="pb-4">
			{tools && <DataTable columns={columns} data={tools} />}
		</div>
	)
}
