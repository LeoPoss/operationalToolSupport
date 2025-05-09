// src/components/multi-select.tsx

import { type VariantProps, cva } from 'class-variance-authority'
import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const multiSelectVariants = cva(
	'm-1 transition ease-in-out delay-150 hover:-translate-y-1 duration-300',
	{
		variants: {
			variant: {
				default:
					'border-foreground/10 drop-shadow-md text-foreground bg-card hover:bg-card/80',
				secondary:
					'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				inverted: 'inverted',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

interface MultiSelectProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof multiSelectVariants> {
	options: {
		label: string
		value: string
		icon?: React.ComponentType<{ className?: string }>
		brand: string
	}[]
	onValueChange: (value: string[]) => void
	defaultValue?: string[]
	placeholder?: string
	animation?: number
	asChild?: boolean
	className?: string
	groupBy?: string
}

export const MultiSelect = React.forwardRef<
	HTMLButtonElement,
	MultiSelectProps
>(
	(
		{
			options,
			onValueChange,
			variant,
			defaultValue = [],
			placeholder = 'Select options',
			animation = 0,
			asChild = false,
			className,
			groupBy,
			...props
		},
		ref
	) => {
		const [selectedValues, setSelectedValues] =
			React.useState<string[]>(defaultValue)
		const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

		React.useEffect(() => {
			if (defaultValue.length > 0) {
				setSelectedValues(defaultValue)
			}
		}, [defaultValue])

		const handleInputKeyDown = (
			event: React.KeyboardEvent<HTMLInputElement>
		) => {
			if (event.key === 'Enter') {
				setIsPopoverOpen(true)
			} else if (event.key === 'Backspace' && !event.currentTarget.value) {
				const newSelectedValues = [...selectedValues]
				newSelectedValues.pop()
				setSelectedValues(newSelectedValues)
				onValueChange(newSelectedValues)
			}
		}

		const toggleOption = (value: string) => {
			const newSelectedValues = selectedValues.includes(value)
				? selectedValues.filter((v) => v !== value)
				: [...selectedValues, value]
			setSelectedValues(newSelectedValues)
			onValueChange(newSelectedValues)
		}

		const handleClear = () => {
			setSelectedValues([])
			onValueChange([])
		}

		const handleTogglePopover = () => {
			setIsPopoverOpen((prev) => !prev)
		}

		const groupSet = (): Set<string> => {
			if (!options) {
				return new Set()
			}
			return new Set(options?.map((o) => o.brand))
		}

		const groupedArray = groupSet()

		return (
			<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						{...props}
						onClick={handleTogglePopover}
						className={cn(
							'flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-card  bg-white',
							className
						)}
					>
						{selectedValues.length > 0 ? (
							<div className="flex justify-between items-center w-full">
								<div className="flex flex-wrap items-center">
									{selectedValues.map((value) => {
										const option = options?.find((o) => o.value === value)
										const IconComponent = option?.icon
										return (
											<Badge
												key={value}
												className={cn(
													multiSelectVariants({ variant, className })
												)}
												style={{
													animationDuration: `${animation}s`,
												}}
											>
												{IconComponent && (
													<IconComponent className="h-4 w-4 mr-2" />
												)}
												{option?.label}
												<XCircle
													className="ml-2 h-4 w-4 cursor-pointer"
													onClick={(event) => {
														event.stopPropagation()
														toggleOption(value)
													}}
												/>
											</Badge>
										)
									})}
								</div>
								<div className="flex items-center justify-between">
									<XIcon
										className="h-4 mx-2 cursor-pointer text-muted-foreground"
										onClick={(event) => {
											event.stopPropagation()
											handleClear()
										}}
									/>
									<Separator
										orientation="vertical"
										className="flex min-h-6 h-full"
									/>
									<ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between w-full mx-auto">
								<span className="text-sm text-muted-foreground mx-3">
									{placeholder}
								</span>
								<ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
							</div>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-[400px] max-w-1/2 p-0 drop-shadow-sm"
					align="start"
					onEscapeKeyDown={() => setIsPopoverOpen(false)}
				>
					<Command>
						<CommandInput
							placeholder="Search..."
							onKeyDown={handleInputKeyDown}
						/>
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							{Array.from(groupedArray).map((g) => (
								<CommandGroup key={g} heading={g}>
									{options
										.filter((o) => o.brand === g)
										.map((option) => {
											const isSelected = selectedValues.includes(option.value)
											return (
												<CommandItem
													key={option.value}
													onSelect={() => toggleOption(option.value)}
													style={{
														pointerEvents: 'auto',
														opacity: 1,
													}}
													className="cursor-pointer"
												>
													<div
														className={cn(
															'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
															isSelected
																? 'bg-primary text-primary-foreground'
																: 'opacity-50 [&_svg]:invisible'
														)}
													>
														<CheckIcon className="h-4 w-4" />
													</div>
													{option.icon && (
														<option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
													)}
													<span>{option.label}</span>
												</CommandItem>
											)
										})}
								</CommandGroup>
							))}
							<CommandSeparator />
							<CommandGroup>
								<div className="flex items-center justify-between">
									{selectedValues.length > 0 && (
										<>
											<CommandItem
												onSelect={handleClear}
												style={{
													pointerEvents: 'auto',
													opacity: 1,
												}}
												className="flex-1 justify-center cursor-pointer"
											>
												Clear
											</CommandItem>
											<Separator
												orientation="vertical"
												className="flex min-h-6 h-full"
											/>
										</>
									)}
									<CommandSeparator />
									<CommandItem
										onSelect={() => setIsPopoverOpen(false)}
										style={{
											pointerEvents: 'auto',
											opacity: 1,
										}}
										className="flex-1 justify-center cursor-pointer"
									>
										Close
									</CommandItem>
								</div>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		)
	}
)

MultiSelect.displayName = 'MultiSelect'
