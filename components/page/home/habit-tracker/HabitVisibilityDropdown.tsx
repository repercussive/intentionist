import { container } from 'tsyringe'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { HabitContext } from '@/components/page/home/habit-tracker/HabitWrapper'
import HabitsHandler, { HabitVisibility } from '@/logic/app/HabitsHandler'
import SelectDropdown from '@/components/app/SelectDropdown'

const HabitVisibilityDropdown = observer(() => {
  const { habit } = useContext(HabitContext)
  const isPrivate = habit.visibility === 'private'

  function handleChangeVisibility(visibility: HabitVisibility) {
    container.resolve(HabitsHandler).changeHabitVisibility(habit, visibility)
  }

  return (
    <SelectDropdown
      title={isPrivate ? 'Private' : 'Public'}
      highlight={!isPrivate}
      anchorRight={true}
    >
      <SelectDropdown.Item
        title="Private"
        description="Only you will be able to see this habit."
        selected={isPrivate}
        onClick={() => handleChangeVisibility('private')}
      />
      <SelectDropdown.Item
        title="Visible to friends"
        description="Friends will be able to see your tracker activity and notes for this habit."
        selected={!isPrivate}
        onClick={() => handleChangeVisibility('public')}
      />
    </SelectDropdown>
  )
})

export default HabitVisibilityDropdown