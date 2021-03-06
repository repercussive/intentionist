import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useMemo, useState } from 'react'
import { getFirstDayOfLastWeek, getFirstDayOfThisWeek } from '@/logic/utils/dateUtilities'
import { startOfMonth, format, isSameMonth, addMonths, endOfMonth, eachWeekOfInterval, isFuture, isSameWeek, isSameDay, setDayOfYear, addWeeks, setYear, startOfDay } from 'date-fns'
import { YearAndDay } from '@/logic/app/HabitStatusesHandler'
import DisplayedHabitsHandler from '@/logic/app/DisplayedHabitsHandler'
import getYearAndDay from '@/logic/utils/getYearAndDay'
import CurrentDateHandler from '@/logic/app/CurrentDateHandler'
import Dropdown from '@/components/modular/Dropdown'
import Flex from '@/components/primitives/Flex'
import Divider from '@/components/primitives/Divider'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import Text from '@/components/primitives/Text'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import Icon from '@/components/primitives/Icon'
import CheckIcon from '@/components/icons/CheckIcon'
import Box from '@/components/primitives/Box'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import IconButton from '@/components/primitives/IconButton'

const WeekSelector = observer(() => {
  const { selectedWeekStartDate, setSelectedWeekStartDate } = container.resolve(DisplayedHabitsHandler)
  const { weekdayId } = container.resolve(CurrentDateHandler)
  const selectedDate = useMemo(() => convertToDate(selectedWeekStartDate), [selectedWeekStartDate])

  const title = useMemo(() => {
    const selectedDateValue = selectedDate.valueOf()
    if (selectedDateValue === getFirstDayOfThisWeek().valueOf()) {
      return 'This week'
    }
    if (selectedDateValue === getFirstDayOfLastWeek().valueOf()) {
      return 'Last week'
    }
    return `Week of ${format(selectedDate, 'd MMM yyyy')}`
  }, [selectedDate, weekdayId])

  const disableNextWeekButton = useMemo(() => {
    return selectedDate >= getFirstDayOfThisWeek()
  }, [selectedDate, weekdayId])

  const changeWeek = useCallback((delta: -1 | 1) => {
    const newDate = addWeeks(selectedDate, delta)
    setSelectedWeekStartDate(getYearAndDay(newDate))
  }, [selectedDate])

  return (
    <Flex center>
      <Flex sx={{ '& > button': { bg: 'transparent' }, width: ['100%', 'auto'] }}>
        <IconButton
          icon={ChevronLeftIcon}
          aria-label="View previous week"
          onClick={() => changeWeek(-1)}
          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} /
        >
        <Dropdown
          title={title}
          noArrow
          sx={{
            flex: 1,
            '& > button': {
              display: 'flex', justifyContent: 'center', px: 0,
              bg: 'transparent', width: ['100%', '15rem'], borderRadius: 0
            }
          }}
        >
          <MenuContent selectedDate={selectedDate} />
        </Dropdown>
        <IconButton
          icon={ChevronRightIcon}
          aria-label="View following week"
          onClick={() => changeWeek(1)}
          disabled={disableNextWeekButton}
          sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        />
      </Flex>
    </Flex>
  )
})

const MenuContent = ({ selectedDate }: { selectedDate: Date }) => {
  const { setSelectedWeekStartDate } = container.resolve(DisplayedHabitsHandler)
  const [displayedMonth, setDisplayedMonth] = useState(startOfMonth(selectedDate))
  const [displayedWeeks, setDisplayedWeeks] = useState(getWeeksInMonth(displayedMonth))
  const [isDisplayingCurrentMonth, setIsDisplayingCurrentMonth] = useState(isSameMonth(displayedMonth, new Date()))

  function handleSelectWeek(startDate: Date) {
    setSelectedWeekStartDate(getYearAndDay(startDate))
  }

  function changeDisplayedMonth(delta: 1 | -1) {
    if (delta === 1 && isDisplayingCurrentMonth) return
    const newMonth = addMonths(displayedMonth, delta)
    setDisplayedMonth(newMonth)
    setDisplayedWeeks(getWeeksInMonth(newMonth))
    setIsDisplayingCurrentMonth(isSameMonth(newMonth, new Date()))
  }

  function getWeeksInMonth(monthStart: Date) {
    const monthEnd = endOfMonth(monthStart)
    return eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 })
      .filter((weekStart) => isSameMonth(weekStart, monthStart))
      .filter((weekStart) => !isFuture(weekStart))
  }

  return (
    <Flex column>
      {!isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 }) && (
        <>
          <ViewThisWeekButton onClick={() => handleSelectWeek(getFirstDayOfThisWeek())} />
          <Divider />
        </>
      )}
      <Flex center>
        <ChangeMonthButton
          icon={ChevronLeftIcon}
          label="View previous month"
          onClick={() => changeDisplayedMonth(-1)}
        />
        <Flex center sx={{ width: '14ch' }}>
          <Text type="span" sx={{ fontWeight: 'semibold' }}>
            {format(displayedMonth, 'MMMM yyyy')}
          </Text>
        </Flex>
        <ChangeMonthButton
          icon={ChevronRightIcon}
          label="View following month"
          onClick={() => changeDisplayedMonth(1)}
          disable={isDisplayingCurrentMonth}
        />
      </Flex>
      <Flex center sx={{ py: 2, bg: 'whiteAlpha.5' }}>
        <Text sx={{ fontSize: '0.8rem', opacity: 0.75 }}>
          View week beginning on
        </Text>
      </Flex>
      {displayedWeeks.map((weekStart, index) => (
        <WeekButton
          weekStart={weekStart}
          selectedDate={selectedDate}
          onSelectWeek={handleSelectWeek}
          key={index}
        />
      ))}
    </Flex>
  )
}

interface WeekButtonProps {
  weekStart: Date
  selectedDate: Date
  onSelectWeek: (startDate: Date) => void
}

const WeekButton = ({ weekStart, selectedDate, onSelectWeek }: WeekButtonProps) => {
  const isSelectedDate = isSameDay(weekStart, selectedDate)

  return (
    <Dropdown.Item
      itemAction={() => onSelectWeek(weekStart)}
      sx={{ ':first-of-type': { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
    >
      <Flex align="center" sx={{ width: '100%' }}>
        <Text type="span">
          Mon {format(weekStart, 'do')}
        </Text>
        {isSelectedDate && (
          <Icon icon={CheckIcon} sx={{ ml: 3 }} />
        )}
      </Flex>
    </Dropdown.Item>
  )
}

const ViewThisWeekButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box sx={{ p: 2, pb: 'calc(0.5rem + 1px)', textAlign: 'center', }}>
      <Dropdown.Item
        sx={{
          bg: 'accent',
          width: '100%',
          margin: '0',
          paddingY: '0.7rem',
          borderRadius: 'default',
          minHeight: '2.5rem'
        }}
        hoverEffect="opacity"
        itemAction={onClick}
      >
        <Flex center>
          View this week
          <Icon icon={ArrowRightIcon} sx={{ ml: 2 }} />
        </Flex>
      </Dropdown.Item>
    </Box>
  )
}

interface ChangeMonthButtonProps {
  icon: () => JSX.Element
  label: string
  onClick: () => void
  disable?: boolean
}

const ChangeMonthButton: FC<ChangeMonthButtonProps> = ({ icon, label, onClick, disable, children }) => (
  <IconButton
    icon={icon}
    aria-label={label}
    onClick={onClick}
    sx={{
      position: 'relative',
      paddingX: 4,
      paddingY: 4,
      backgroundColor: 'transparent !important',
      opacity: disable ? 0.5 : 1,
      cursor: disable ? 'default' : undefined,
      '&:hover::after': {
        content: '""',
        position: 'absolute',
        inset: '4px',
        borderRadius: 'default',
        backgroundColor: disable ? '' : 'buttonHighlight'
      }
    }}
  >
    {children}
  </IconButton>
)

function convertToDate(yearAndDay: YearAndDay) {
  const { year, dayOfYear } = yearAndDay
  return setDayOfYear(setYear(startOfDay(new Date()), year), dayOfYear)
}

export default WeekSelector