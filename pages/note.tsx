import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { createContext, useContext, useState } from 'react'
import { format } from 'date-fns'
import { Global } from '@emotion/react'
import { css } from '@theme-ui/css'
import NoteEditor, { NoteDocumentData } from '@/logic/app/NoteEditor'
import HabitsHandler from '@/logic/app/HabitsHandler'
import withApp from '@/components/app/withApp'
import LoadingScreen from '@/components/app/LoadingScreen'
import SmartEmoji from '@/components/app/SmartEmoji'
import NoteViewer from '@/components/page/note/NoteViewer'
import NoteMetadataEditor from '@/components/page/note/NoteMetadataEditor'
import NoteNavSection from '@/components/page/note/NoteNavSection'
import NoteMetadata from '@/components/page/note/NoteMetadata'
import FadeIn from '@/components/primitives/FadeIn'
import Flex from '@/components/primitives/Flex'
import Spacer from '@/components/primitives/Spacer'
import Text from '@/components/primitives/Text'
import Head from 'next/head'

export const NoteContext = createContext<{ editor: NoteEditor, noteData: NoteDocumentData }>(null!)

const NotePage = observer(() => {
  const [editor] = useState(container.resolve(NoteEditor))

  if (!editor.note) return (
    <>
      <Head><title>...</title></Head>
      <LoadingScreen />
      <FontPreload />
    </>
  )

  return (
    <NoteContext.Provider value={{ editor, noteData: editor.note }}>
      <Head><title>{editor.note.title || 'New note'}</title></Head>
      <FadeIn sx={{ maxWidth: '750px', margin: 'auto' }}>
        <NoteNavSection />
        <Spacer mb={4} />
        <DateAndHabit />
        <Spacer mb={[2, 3]} />
        {!!editor.isEditing ? <NoteMetadataEditor /> : <NoteMetadata />}
        <NoteViewer />
      </FadeIn>
      <FontPreload />
    </NoteContext.Provider>
  )
})

const DateAndHabit = () => {
  const { noteData } = useContext(NoteContext)
  const [habit] = useState(container.resolve(HabitsHandler).habits.find((habit) => habit.id === noteData.habitId))
  if (!habit) return null

  return (
    <Flex align="center" flexWrap>
      <Text type="span" sx={{ opacity: 0.5, mr: 2 }}>
        {format(new Date(noteData.date), 'd MMM yyyy')} in
      </Text>
      <Flex center sx={{ maxWidth: '100%' }}>
        <SmartEmoji nativeEmoji={habit.icon} rem={1.2} />
        <Text type="span" sx={{ ml: 2, opacity: 0.5, maxWidth: '100%', overflowWrap: 'break-word' }}>
          {habit.name}
        </Text>
      </Flex>
    </Flex>
  )
}

const FontPreload = () => {
  return (
    <>
      <Global styles={css({
        '@font-face': {
          fontFamily: 'Inter Extended',
          fontWeight: '1 999',
          'src': `url('/fonts/Inter-var-extended.woff2') format('woff2')`,
          'fontDisplay': 'swap'
        },
      })}
      />
      <span sx={{ fontFamily: 'Inter Extended', pointerEvents: 'none' }} role="none presentation" />
    </>
  )
}

export default withApp(NotePage, 'notes')