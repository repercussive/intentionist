import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { getFirstDayOfThisWeek } from '@/logic/utils/dateUtilities'
import DisplayedHabitsHandler from '@/logic/app/DisplayedHabitsHandler'
import CurrentDateHandler from '@/logic/app/CurrentDateHandler'
import getYearAndDay from '@/logic/utils/getYearAndDay'
import Flex from '@/components/primitives/Flex'
import Text from '@/components/primitives/Text'

const shellArray = Array.from({ length: 7 })
const weekdayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const WeekdayRow = observer(() => {
  const { weekdayId } = container.resolve(CurrentDateHandler)
  const { selectedWeekStartDate } = container.resolve(DisplayedHabitsHandler)

  const isViewingThisWeek = useMemo(() => {
    const { year: thisYear, dayOfYear: today } = getYearAndDay(getFirstDayOfThisWeek())
    return selectedWeekStartDate.year === thisYear && selectedWeekStartDate.dayOfYear === today
  }, [weekdayId, selectedWeekStartDate])

  return (
    <Flex
      align="center"
      sx={{
        mx: ['-0.5rem', 'auto'],
        justifyContent: 'space-around',
      }}>
      {shellArray.map((_, index) => (
        <Text
          type="span"
          sx={{
            width: '1.5rem', textAlign: 'center',
            ...(isViewingThisWeek && weekdayId === index ? {
              color: 'text',
              fontWeight: 'semibold'
            } : {
              color: 'accent',
              opacity: 0.8
            })
          }}
          key={index}
        >
          {weekdayInitials[index]}
        </Text>
      ))}
    </Flex>
  )
})

export default WeekdayRow