import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { brands, toolType } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const AddTool = () => {
	const queryClient = useQueryClient()

	const formSchema = z.object({
		externalId: z.string().min(2).max(10),
		brand: z.enum(brands),
		type: z.enum(toolType),
		name: z.string().min(2).max(10),
		model: z.string().min(2).max(10),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const [open, setOpen] = useState(false)

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		console.log(data)
		axios
			.post(`${process.env.NEXT_PUBLIC_BASE_API}/tools`, data)
			.then((r) => {
				toast.error('Added new tool')
				setOpen(false)
				queryClient.refetchQueries({ queryKey: ['tools'] })
			})
			.catch((e) => {
				toast.error(e)
			})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button>
					<PlusCircle className="mr-2" size={32} weight="duotone" /> Add tool
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Add new tool</DialogTitle>
						</DialogHeader>

						<div className="space-y-2 my-4">
							<FormField
								control={form.control}
								name="externalId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Id</FormLabel>
										<FormControl>
											<Input placeholder="MAK001" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="brand"
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormLabel>Brand</FormLabel>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{brands?.map((val) => (
												<SelectItem key={val} value={val}>
													{val}
												</SelectItem>
											))}
										</SelectContent>
										<FormMessage />
									</Select>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormLabel>Tool type</FormLabel>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{toolType.map((val) => (
												<SelectItem key={val} value={val}>
													{val}
												</SelectItem>
											))}
										</SelectContent>
										<FormMessage />
									</Select>
								)}
							/>
							<FormField
								control={form.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Model</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="mt-4">
							<Button type="submit">Add tool</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
