'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTasks } from '@/lib/actions'
import type { Task } from '@/lib/types'
import { Warning } from '@phosphor-icons/react'
import { compareDesc, formatDistance } from 'date-fns'
import type { Key } from 'react'

export const TaskList = ({
	onRowClick,
	selectedTask,
}: { onRowClick: (item: Task) => void; selectedTask: Task }) => {
	const { data: tasks, isLoading } = useTasks()

	if (isLoading) {
		return (
			<div className="flex flex-col space-y-3">
				<div className="space-y-2">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
				</div>
			</div>
		)
	}

	if (tasks?.length === 0) {
		return (
			<div className="flex flex-col p-4">
				<span className="font-medium">Currently no tasks</span>
				<span className="text-sm text-muted-foreground">
					Trigger condition maybe
				</span>
			</div>
		)
	}

	return (
		<>
			<Table className="rounded-2xl">
				<TableBody className="[&_tr:last-child]:border-y-0">
					{tasks
						?.sort((a, b) => compareDesc(a.created, b.created))
						.map((task: Task) => (
							<TableRow
								key={task.id}
								onClick={() => onRowClick(task)}
								className={`cursor-pointer ${
									selectedTask?.id === task.id
										? 'border-l-4 border-l-red-500 bg-red-50 hover:bg-red-100'
										: ''
								}`}
							>
								<TableCell>
									{task.priority === 100 ? (
										<Warning color="red" className="mr-2" />
									) : (
										''
									)}
								</TableCell>
								<TableCell className="font-medium">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>{task.name}</TooltipTrigger>
											<TooltipContent>
												<p>Id: {task.id}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
								<TableCell>
									{formatDistance(task.created, new Date(), {
										addSuffix: true,
									})}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</>
	)
}
