import { container } from 'tsyringe'
import { createContext } from 'react'
import { withApp } from '@/components/app'
import { FadeIn } from '@/components/primitives'
import { FilteredHabitsList, HabitsPageNavSection } from '@/components/page/habits'
import HabitFilterHandler from '@/lib/logic/app/HabitFilterHandler'
import Head from 'next/head'

export const HabitFilterContext = createContext<HabitFilterHandler>(null!)

const HabitsPage = () => {
  return (
    <HabitFilterContext.Provider value={container.resolve(HabitFilterHandler)}>
      <Head><title>Habits</title></Head>
      <FadeIn maxWidth="habits" margin="auto">
        <HabitsPageNavSection />
        <FilteredHabitsList />
      </FadeIn>
    </HabitFilterContext.Provider>
  )
}

export default withApp(HabitsPage, 'neutral')