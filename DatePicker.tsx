import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn, dayToMs } from '@/lib/utils'
import { CalendarIcon, X } from 'lucide-react'
import React from 'react'
import { FormControl } from './form'

type DatePickerProps = {
	selectedDate: Date | undefined | null
	setSelectedDate: (date: Date | undefined) => void
	disabledBefore?: string | Date
	disabledAfter?: string | Date
	isForm?: boolean
} & React.ComponentProps<typeof Button>

// the date string is in french format : eg. 01/01/2022 or 01012022
function completeDateFromString(date: string) {
	let [day, month, year] = date.split(/[/]/g)

	let finalDate = new Date()

	if (day) {
		let intDay = parseInt(day)
		if (intDay > 31) {
			day = '31'
		} else if (intDay < 1) {
			day = '01'
		}
		finalDate.setUTCDate(parseInt(day))
	} else {
		day = finalDate.getUTCDate().toString()
	}

	if (month) {
		let intMonth = parseInt(month)
		if (intMonth > 12) {
			month = '12'
		} else if (intMonth < 1) {
			month = '01'
		}
		finalDate.setUTCMonth(parseInt(month) - 1)
	} else {
		month = (finalDate.getUTCMonth() + 1).toString()
	}

	if (year) {
		let intYear = parseInt(year)
		if (intYear > 9999) {
			year = new Date().getUTCFullYear().toString()
		} else if (intYear < 1) {
			year = '0001'
		}
		finalDate.setUTCFullYear(parseInt(year))
	} else {
		year = finalDate.getUTCFullYear().toString()
	}

	return {
		date: finalDate,
		stringDate: `${day}/${month}/${year}`,
	}
}

function DatePicker({
	selectedDate,
	setSelectedDate,
	disabledBefore,
	disabledAfter = new Date(),
	isForm,
	'data-tooltip-content': tooltipContent,
	...props
}: DatePickerProps) {
	const Comp = isForm ? FormControl : React.Fragment
	const [stringDate, setStringDate] = React.useState<string>('')
	const [month, setMonth] = React.useState<Date>(selectedDate || new Date())
	const [isOpen, setIsOpen] = React.useState(false)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const isDigitKey = e.key.match(/[0-9]/)
		const isBackspaceKey = e.key === 'Backspace'
		const isDeleteKey = e.key === 'Delete'

		if (isDigitKey) {
			e.preventDefault()
			let newStr = stringDate + e.key
			if (newStr.length === 2 || newStr.length === 5) {
				newStr += '/'
			}
			const { date } = completeDateFromString(newStr)
			setStringDate(newStr)
			setMonth(date)

			if (newStr.length === 10) {
				setSelectedDate(date)
			}
		}

		if (isBackspaceKey || isDeleteKey) {
			e.preventDefault()

			if (stringDate.length === 0) {
				return
			}

			setStringDate((prev) => {
				const newStr = prev.slice(0, -1)
				const charRemoved = prev.slice(-1)
				if (charRemoved === '/') {
					return newStr.slice(0, -1)
				}
				return newStr
			})

			setSelectedDate(undefined)
		}

		if (e.key === 'Enter') {
			const { date } = completeDateFromString(stringDate)
			setSelectedDate(date)
			setIsOpen(false)
		}
	}

	return (
		<Popover
			modal={true}
			onOpenChange={setIsOpen}
			open={isOpen}
		>
			<div className="relative w-max">
				<Comp>
					<PopoverTrigger asChild>
						<Button
							{...props}
							data-tooltip-content={tooltipContent ?? undefined}
							variant={'outline'}
							type="button"
							onClick={() => {
								setIsOpen((prev) => !prev)
							}}
							className={cn(
								'w-[140px] pl-3 text-left font-normal group justify-between focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
								!selectedDate && 'text-muted-foreground',
								isOpen && 'ring-ring ring-2 ring-offset-2'
							)}
						>
							{stringDate.length > 0 && stringDate.length < 10 ? (
								<span className="tabular-nums">{stringDate}</span>
							) : selectedDate ? (
								<span className="tabular-nums">
									{selectedDate.toLocaleDateString('fr-fr')}
								</span>
							) : (
								<span className="tabular-nums">--/--/----</span>
							)}

							<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
						</Button>
					</PopoverTrigger>
				</Comp>
				{selectedDate && (
					<Button
						className="absolute w-6 h-6 p-0 transition-opacity -translate-y-1/2 top-1/2 right-3"
						variant={'destructive'}
						data-tooltip-content={'Supprimer la date'}
						type="button"
						onClick={() => {
							setSelectedDate(undefined)
							setStringDate('')
						}}
					>
						<X size={12} />
					</Button>
				)}
			</div>
			<PopoverContent
				className="w-auto p-0"
				align="start"
				onKeyDown={handleKeyDown}
			>
				<Calendar
					required
					mode="single"
					selected={selectedDate ?? month ?? new Date()}
					onSelect={(e) => {
						setSelectedDate(e)
						setStringDate(e.toLocaleDateString('fr-fr'))
						setIsOpen(false)
					}}
					captionLayout="dropdown"
					startMonth={new Date(disabledBefore || '1900-01-01')}
					endMonth={new Date(disabledAfter)}
					disabled={(date) =>
						date < new Date(disabledBefore || '1900-01-01') ||
						date > new Date(disabledAfter)
					}
					fixedWeeks
					showOutsideDays
					defaultMonth={selectedDate ?? month ?? new Date()}
					month={month}
					autoFocus
					onMonthChange={setMonth}
				/>
			</PopoverContent>
		</Popover>
	)
}

export default DatePicker
