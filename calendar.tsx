'use client'

import 'react-day-picker/style.css'
import { fr } from 'react-day-picker/locale'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import {
	DayPicker,
	labelNext,
	labelPrevious,
	useDayPicker,
} from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
	SelectGroup,
} from '@/components/ui/select'
import { frenchMonthsDropDownOptions } from '@/data/dates'

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			timeZone="Europe/Paris"
			showOutsideDays={showOutsideDays}
			weekStartsOn={1}
			locale={fr}
			showWeekNumber
			className={cn('py-2', className)}
			classNames={{
				months: 'relative flex flex-col gap-y-4 sm:flex-row sm:gap-y-0',
				month_caption:
					'relative mx-10 flex h-7 items-center justify-center pt-2',
				weekdays:
					'flex flex-row w-full items-center justify-center gap-x-1 ml-3',
				weekday: 'w-8 text-[0.8rem] font-normal text-muted-foreground',
				month: 'w-full gap-y-4 overflow-x-hidden',
				caption: 'relative flex items-center justify-center pt-1',
				caption_label: 'truncate text-sm font-medium',
				button_next: cn(
					buttonVariants({
						variant: 'outline',
						className:
							'absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
					})
				),
				button_previous: cn(
					buttonVariants({
						variant: 'outline',
						className:
							'absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
					})
				),
				nav: 'flex items-start pt-1',
				month_grid: 'mb-2 mx-2 mt-3',
				week: 'mt-2 flex w-full',
				day: 'flex h-9 w-9 flex-1 items-center justify-center rounded-md p-0 text-sm [&:has(button)]:hover:bg-accent! [&:has(button)]:hover:text-accent-foreground [&:has(button)]:hover:aria-selected:bg-primary! [&:has(button)]:hover:aria-selected:text-primary-foreground',
				day_button: cn(
					buttonVariants({ variant: 'ghost' }),
					'h-9 w-9 p-0 font-normal transition-none hover:bg-transparent hover:text-inherit aria-selected:opacity-100'
				),
				range_start: 'day-range-start rounded-s-md',
				range_end: 'day-range-end rounded-e-md',
				selected:
					'bg-primary text-primary-foreground hover:bg-primary! hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
				today: 'bg-accent text-accent-foreground',
				outside:
					'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
				disabled: 'text-muted-foreground opacity-40',
				range_middle:
					'rounded-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:aria-selected:bg-accent! hover:aria-selected:text-accent-foreground',
				hidden: 'invisible hidden',
				chevron: `inline-block fill-muted-foreground`,
				week_number:
					'text-muted-foreground font-normal bg-muted text-xs flex items-end justify-center h-9 w-7 py-2',
				week_number_header: 'text-muted-foreground',
				...classNames,
			}}
			components={{
				Dropdown: ({ ...props }) => {
					const { options, className, disabled } = props
					const { goToMonth, months } = useDayPicker()
					const currentShown = months[0].date

					const currentSelection =
						className === 'rdp-years_dropdown'
							? currentShown.getFullYear().toString()
							: currentShown.getMonth().toString()

					const updateDayPickerState = (value: string) => {
						const newDate = new Date(currentShown)
						if (className === 'rdp-years_dropdown') {
							newDate.setFullYear(parseInt(value))
						} else if (className === 'rdp-months_dropdown') {
							newDate.setMonth(parseInt(value))
						}
						goToMonth(newDate)
					}

					return (
						<Select
							value={currentSelection}
							onValueChange={updateDayPickerState}
							disabled={disabled}
						>
							<SelectTrigger className="flex items-center w-full gap-1 px-2 border-0 hover:bg-accent hover:text-accent-foreground h-7">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{options?.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value.toString()}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					)
				},
				MonthsDropdown: ({ ...props }) => {
					const { components } = useDayPicker()
					const options = frenchMonthsDropDownOptions

					return (
						<components.Dropdown
							{...props}
							options={options}
						/>
					)
				},

				YearsDropdown: ({ ...props }) => {
					const { components } = useDayPicker()
					// sort years in descending order
					const options = props.options?.sort((a, b) => b.value - a.value) ?? []

					return (
						<components.Dropdown
							{...props}
							options={options}
						/>
					)
				},
				PreviousMonthButton: ({ className, ...props }) => {
					const previousMonth = useDayPicker().previousMonth
					return (
						<Button
							variant="ghost"
							className={cn('absolute left-0 ml-2 disabled:hidden', className)}
							type="button"
							tabIndex={previousMonth ? -1 : undefined}
							disabled={!previousMonth}
							aria-label={labelPrevious(previousMonth)}
							onClick={props.onClick}
						>
							<ChevronLeftIcon className="w-4 h-4" />
						</Button>
					)
				},
				NextMonthButton: ({ className, ...props }) => {
					let nextMonth = useDayPicker().nextMonth

					return (
						<Button
							variant="ghost"
							className={cn('absolute right-0 mr-2 disabled:hidden', className)}
							type="button"
							tabIndex={nextMonth ? -1 : undefined}
							disabled={!nextMonth}
							aria-label={labelNext(nextMonth)}
							onClick={props.onClick}
						>
							<ChevronRightIcon className="w-4 h-4" />
						</Button>
					)
				},
			}}
			{...props}
		/>
	)
}
Calendar.displayName = 'Calendar'

export { Calendar }
