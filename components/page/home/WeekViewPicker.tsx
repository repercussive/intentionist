import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import weeksHandler, { WeekView } from '@/logic/app/weeksHandler'
import accentColorHandler from '@/logic/ui/accentColorHandler'
import CalendarIcon from '@/components/icons/CalendarIcon'
import JournalIcon from '@/components/icons/JournalIcon'
import TimerIcon from '@/components/icons/TimerIcon'
import Flex from '@/components/primitives/Flex'
import IconButton from '@/components/primitives/IconButton'

const buttonData: Array<{ view: WeekView, text: string, icon: () => JSX.Element }> = [
  { view: 'tracker', text: 'Habit tracker', icon: CalendarIcon },
  { view: 'journal', text: 'Journal', icon: JournalIcon },
  { view: 'focus', text: 'Focused time', icon: TimerIcon }
]

const WeekViewPicker = () => {
  const { view, setView } = weeksHandler()

  useEffect(() => {
    accentColorHandler.setAccentColor(view)
  }, [view])

  return (
    <Flex>
      {buttonData.map((data, index) => (
        <IconButton
          icon={data.icon}
          onClick={() => setView(data.view)}
          flex={1}
          mr={index < 2 ? 3 : 0}
          bg={data.view === view ? accentColorHandler.accentColor : ''}
          style={{ transition: 'var(--focus-transition), background-color 200ms' }}
          key={data.view}
        >
          {data.text}
        </IconButton>
      ))}
    </Flex>
  )
}

export default observer(WeekViewPicker)