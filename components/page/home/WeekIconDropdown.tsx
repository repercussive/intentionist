import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { BaseEmoji } from 'emoji-mart'
import { HomePageContext } from 'pages/home'
import WeekIconsHandler from '@/logic/app/WeekIconsHandler'
import WeekHandler from '@/logic/app/WeekHandler'
import EmojiPicker from '@/components/app/EmojiPicker'
import Dropdown from '@/components/app/Dropdown'
import SmartEmoji from '@/components/app/SmartEmoji'
import Icon from '@/components/primitives/Icon'
import Flex from '@/components/primitives/Flex'
import PencilIcon from '@/components/icons/PencilIcon'

const WeekIconDropdown = observer(() => {
  const { weekInView: { data: { icon } }, isLoadingWeek } = container.resolve(WeekHandler)
  const { setIcon, removeIcon } = container.resolve(WeekIconsHandler)
  const { narrow } = useContext(HomePageContext)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  function handleSelectEmoji(emoji: BaseEmoji) {
    setIcon(emoji.native)
  }

  return (
    <>
      <Dropdown title={<DropdownTitle />} anchorRight={narrow} disabled={isLoadingWeek}>
        <Dropdown.Item itemAction={() => setShowEmojiPicker(true)}>
          {!!icon ? 'Change' : 'Add'} week icon
        </Dropdown.Item>
        {!!icon && (
          <Dropdown.Item itemAction={removeIcon}>
            Remove week icon
          </Dropdown.Item>
        )}
      </Dropdown>
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClosePicker={() => setShowEmojiPicker(false)}
        label="as your week's icon"
        onSelectEmoji={handleSelectEmoji}
      />
    </>
  )
})

const DropdownTitle = observer(() => {
  const { weekInView: { data: { icon } } } = container.resolve(WeekHandler)

  if (icon) {
    return (
      <Flex center sx={{ transform: 'scale(1.2)' }}>
        <SmartEmoji nativeEmoji={icon} rem={1} />
      </Flex>
    )
  }

  return <Icon icon={PencilIcon} />
})

export default WeekIconDropdown