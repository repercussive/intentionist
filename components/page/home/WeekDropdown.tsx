import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { addMonths, eachWeekOfInterval, endOfMonth, format, isFuture, isSameDay, isSameMonth, isSameWeek, startOfMonth, subWeeks } from 'date-fns'
import { formatFirstDayOfThisWeek, formatYYYYMMDD, separateYYYYfromMMDD } from '@/lib/logic/utils/dateUtilities'
import NewWeekPromptHandler from '@/lib/logic/app/NewWeekPromptHandler'
import WeekHandler from '@/lib/logic/app/WeekHandler'
import WeekIconsHandler from '@/lib/logic/app/WeekIconsHandler'
import accentColor from '@/lib/logic/utils/accentColor'
import Dropdown from '@/components/app/Dropdown'
import Box from '@/components/primitives/Box'
import Flex from '@/components/primitives/Flex'
import Icon from '@/components/primitives/Icon'
import IconButton from '@/components/primitives/IconButton'
import Spacer from '@/components/primitives/Spacer'
import Text from '@/components/primitives/Text'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import SmartEmoji from '@/components/app/SmartEmoji'

const WeekDropdown = observer(() => {
  const { startDate } = container.resolve(WeekHandler).weekInView
  const { thisWeekStartDate } = container.resolve(NewWeekPromptHandler)

  let title: string
  if (startDate === formatYYYYMMDD(thisWeekStartDate)) {
    title = 'This week'
  } else if (startDate === formatYYYYMMDD(subWeeks(thisWeekStartDate, 1))) {
    title = 'Last week'
  } else {
    title = `Week of ${format(new Date(startDate), 'd MMM yyyy')}`
  }

  return (
    <Dropdown title={title} sx={{ flex: 1 }}>
      <WeekSelectMenu />
    </Dropdown>
  )
})

const WeekSelectMenu = () => {
  const weekHandler = container.resolve(WeekHandler)
  const [selectedDate] = useState(new Date(weekHandler.weekInView.startDate))
  const [displayedMonth, setDisplayedMonth] = useState(startOfMonth(selectedDate))
  const [displayedWeeks, setDisplayedWeeks] = useState(getWeeksInMonth(displayedMonth))
  const [isDisplayingCurrentMonth, setIsDisplayingCurrentMonth] = useState(isSameMonth(displayedMonth, new Date()))

  function handleSelectWeek(startDate: Date, cachedIcon?: string) {
    weekHandler.viewWeek(formatYYYYMMDD(startDate), cachedIcon)
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
          <ViewThisWeekButton />
          <Divider />
        </>
      )}
      <Flex center>
        <ChangeMonthButton
          icon={ChevronLeftIcon}
          onClick={() => changeDisplayedMonth(-1)}
        />
        <Flex center sx={{ width: '14ch' }}>
          <Text type="span" sx={{ fontWeight: 'semibold' }}>
            {format(displayedMonth, 'MMMM yyyy')}
          </Text>
        </Flex>
        <ChangeMonthButton
          icon={ChevronRightIcon}
          onClick={() => changeDisplayedMonth(1)}
          disable={isDisplayingCurrentMonth}
        />
      </Flex>
      <Divider />
      <Flex sx={{ py: 2, bg: 'whiteAlpha.5' }}>
        <Text sx={{ fontSize: '0.8rem', opacity: 0.75, pl: 2 }}>
          View week beginning on
        </Text>
      </Flex>
      <Divider />
      <Spacer mt='1px' />
      {displayedWeeks.map((weekStart, index) => (
        <WeekButton weekStart={weekStart} selectedDate={selectedDate} onSelectWeek={handleSelectWeek} key={index} />
      ))}
    </Flex>
  )
}

interface WeekButtonProps {
  weekStart: Date,
  selectedDate: Date,
  onSelectWeek: (startDate: Date, cachedIcon: string) => void
}

const WeekButton = observer(({ weekStart, selectedDate, onSelectWeek }: WeekButtonProps) => {
  const { iconsCache, cacheIconsInYear } = container.resolve(WeekIconsHandler)
  const { yyyy, mmdd } = separateYYYYfromMMDD(formatYYYYMMDD(weekStart))
  const isSelectedDate = isSameDay(weekStart, selectedDate)
  const weekIcon = iconsCache[yyyy]?.[mmdd]
  cacheIconsInYear(yyyy)

  return (
    <Dropdown.Item
      itemAction={() => onSelectWeek(weekStart, weekIcon)}
      sx={{ ':first-of-type': { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
    >
      <Flex align="center" sx={{ width: '100%' }}>
        <Text
          type="span"
          sx={isSelectedDate ? {
            color: accentColor.current,
            filter: 'brightness(1.2)'
          } : {}}
        >
          Mon {format(weekStart, 'do')}
        </Text>
        {!!weekIcon && (
          <Box sx={{ ml: 'auto' }}>
            <SmartEmoji nativeEmoji={weekIcon} rem={1.2} />
          </Box>
        )}
      </Flex>
    </Dropdown.Item>
  )
})

const ViewThisWeekButton = () => {
  const { hidePrompt: hideNewWeekPrompt } = container.resolve(NewWeekPromptHandler)

  function handleViewThisWeek() {
    container.resolve(WeekHandler).viewWeek(formatFirstDayOfThisWeek())
    hideNewWeekPrompt()
  }

  return (
    <Box sx={{ p: 2, pb: 'calc(0.5rem + 1px)', textAlign: 'center', }}>
      <Dropdown.Item
        sx={{
          bg: accentColor.current,
          width: '100%',
          margin: '0',
          paddingY: '0.7rem',
          borderRadius: 'default',
          minHeight: '2.5rem'
        }}
        hoverEffect="opacity"
        itemAction={handleViewThisWeek}
      >
        <Flex center>
          View this week
          <Icon icon={ArrowRightIcon} sx={{ ml: 2 }} />
        </Flex>
      </Dropdown.Item>
    </Box>
  )
}

const ChangeMonthButton: FC<{ icon: () => JSX.Element, onClick: () => void, disable?: boolean }> = ({ icon, onClick, disable, children }) => (
  <IconButton
    icon={icon}
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

const Divider = () => <Box sx={{ borderTop: 'solid 1px', borderColor: 'whiteAlpha.10' }} />

export default WeekDropdown