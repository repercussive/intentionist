import { observer } from 'mobx-react-lite'
import Dropdown from '@/components/modular/Dropdown'
import IconButton from '@/components/primitives/IconButton'
import Flex from '@/components/primitives/Flex'
import PlusIcon from '@/components/icons/PlusIcon'
import NextLink from 'next/link'

const HabitActions = observer(() => {
  return (
    <Flex>
      <NextLink href="/habit?new">
        <IconButton
          icon={PlusIcon}
          hoverEffect="opacity"
          sx={{ bg: 'buttonAccent' }}
          title="New habit"
        />
      </NextLink>
      <Dropdown
        label="More habit options"
        anchorRight
        sx={{ marginLeft: '5px', '& > button': { bg: 'transparent' } }}
      >
        <Dropdown.Item href="/habits">Reorder habits</Dropdown.Item>
        <Dropdown.Item href="/archive">View archived habits</Dropdown.Item>
      </Dropdown>
    </Flex>
  )
})

export default HabitActions