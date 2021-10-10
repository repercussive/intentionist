import { SmartEmoji } from '@/components/app'
import { Flex, Text } from '@/components/primitives'
import { Habit } from '@/lib/logic/app/HabitsHandler'

const HabitCell = ({ habit }: { habit: Habit }) => {
  return (
    <Flex center justify="flex-start" sx={{ minHeight: 'row', borderBottom: 'solid 1px', borderColor: 'grid', pl: 2 }}>
      <SmartEmoji nativeEmoji={habit.icon} nativeFontSize="1.25rem" twemojiSize={18} />
      <Text
        type="span"
        sx={{
          maxWidth: 'min(30vw, 50ch)',
          marginLeft: 2,
          paddingY: '2px',
          paddingRight: ['0.6em', 3],
          overflowWrap: 'break-word'
        }}
      >
        {habit.name}
      </Text>
    </Flex>
  )
}

export default HabitCell