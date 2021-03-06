import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { HabitEditorContext } from 'pages/habit'
import HabitOptionsDropdown from './HabitOptionsDropdown'
import Button from '@/components/primitives/Button'
import Flex from '@/components/primitives/Flex'
import IconButton from '@/components/primitives/IconButton'
import Text from '@/components/primitives/Text'
import CrossIcon from '@/components/icons/CrossIcon'

const HabitEditorNavSection = () => {
  const editor = useContext(HabitEditorContext)

  return (
    <Flex sx={{ pb: [2, 3], borderBottom: 'solid 1px', borderColor: 'divider' }}>
      {editor.isNewHabit && <IconButton icon={CrossIcon} onClick={editor.exit} sx={{ mr: [2, 3, 4], bg: 'transparent' }} />}
      <Text
        type="span"
        sx={{
          color: 'whiteAlpha.70',
          alignSelf: 'center',
          transform: editor.isNewHabit ? 'translateY(-0.075rem)' : ['translateY(0.25rem)', 'translateY(0.45rem)']
        }}
      >
        {editor.isNewHabit ? 'Adding new ' : 'Editing '}habit
      </Text>
      <Button
        onClick={editor.saveAndExit}
        disabled={!editor.habit?.name}
        hoverEffect="opacity"
        sx={{
          ml: 'auto',
          bg: 'buttonAccent',
          fontWeight: 'medium'
        }}
      >
        {editor.isNewHabit ? 'Add' : 'Save'}
      </Button>
      {!editor.isNewHabit && <HabitOptionsDropdown />}
    </Flex>
  )
}

export default observer(HabitEditorNavSection)