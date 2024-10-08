'use client'
import { AddTool } from '@/components/addTool'
import { InjectLeaveCompany } from '@/components/injectLeaveCompany'
import { StartProcessInstance } from '@/components/startProcessInstance'
import { TaskDetail } from '@/components/taskDetail'
import { TaskList } from '@/components/taskList'
import { TaskToTool } from '@/components/taskToTool'
import { ToolTable } from '@/components/toolTable'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTaskTypes } from '@/lib/actions'
import { Terminal } from '@phosphor-icons/react'
import type React from 'react'
import { useState } from 'react'
import SockJsClient from 'react-stomp'

export default function Home() {
	const { data: taskTypes } = useTaskTypes()

	const [selectedItem, setSelectedItem] = useState(null)

	const handleRowClick = (item: React.SetStateAction<null>) => {
		setSelectedItem(item)
	}

	const [message, setMessage] = useState('')
	const onConnected = () => {
		console.log('Connected!!')
	}

	const [showDrawer, setShowDrawer] = useState(false)

	const onMessageReceived = (msg: React.SetStateAction<string>) => {
		console.log(`message received ${msg}`)
		setShowDrawer(true)
		setMessage(msg)
	}

	const SOCKET_URL = `${process.env.NEXT_PUBLIC_BASE_API}/ws`

	return (
		<main>
			<SockJsClient
				url={SOCKET_URL}
				topics={['/topic/notify']}
				onConnect={onConnected}
				onDisconnect={() => console.log('Disconnected!')}
				onMessage={(msg: React.SetStateAction<string>) =>
					onMessageReceived(msg)
				}
				debug={false}
			/>
			<AlertDialog open={showDrawer}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Attention!</AlertDialogTitle>
						<AlertDialogDescription>{message}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button onClick={() => setShowDrawer(false)}>
							I know it, thank you!
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Alert>
				<Terminal className="h-4 w-4" weight="duotone" />
				<AlertTitle>Demonstration Environment</AlertTitle>
				<AlertDescription>
					<i>
						There is no guarantee that this software is completely bug-free
						(reloading on frontend errors resolves most hiccups)
					</i>
					<Accordion type="single" collapsible>
						<AccordionItem value="item-1">
							<AccordionTrigger>Instructions</AccordionTrigger>
							<AccordionContent>
								<ul className="list-disc ml-5 mt-4">
									<li>Start process instance</li>
									<li>Select task type</li>
									<li>"Collect" needed tools and finish task</li>
									<li>Inject leaving the company with specific tools</li>
									<li>
										Either get message that you are missing something or work at
										customer
									</li>
									<li>Return tools</li>
								</ul>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</AlertDescription>
			</Alert>

			<div className="flex space-x-8">
				<div>
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">
						Tools
					</h3>
					<ToolTable />
					<AddTool />
				</div>
				<div>
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">
						Needed Tools for Task Type
					</h3>
					<div className="">
						{taskTypes?.map((t) => (
							<TaskToTool key={t} taskType={t} />
						))}
					</div>
				</div>
			</div>

			<Separator className="my-4" />

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">
				Current Tasks
			</h3>

			<div className="grid grid-cols-3 space-x-8">
				<StartProcessInstance />
				<InjectLeaveCompany />
			</div>

			<div className="grid grid-cols-2 gap-8 mt-4">
				<div className="col-span-1 rounded-lg">
					<TaskList onRowClick={handleRowClick} selectedTask={selectedItem} />
				</div>
				<div className="col-span-1">
					{selectedItem && (
						<TaskDetail task={selectedItem} setSelectedItem={setSelectedItem} />
					)}
				</div>
			</div>
		</main>
	)
}
