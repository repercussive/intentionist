import { withApp } from '@/components/app'
import { WeekTable, WeekViewPicker } from '@/components/page/home'
import { Box, Spacer } from '@/components/primitives'
import Head from 'next/head'

const Home = withApp(() => {
  return (
    <Box maxWidth="max" margin="auto">
      <Head><title>Home</title></Head>
      <WeekViewPicker />
      <Spacer mb={6} />
      <WeekTable />
      <Spacer mb={6} />
    </Box>
  )
})

export default Home