import withApp from '@/lib/withApp'
import profileHandler from '@/lib/app/profileHandler'
import Head from 'next/head'
import CenteredFlex from '@/components/primitives/CenteredFlex'
import Heading from '@/components/primitives/Heading'
import Text from '@/components/primitives/Text'
import FadeIn from '@/components/primitives/FadeIn'

const Home = withApp(() => {
  return (
    <FadeIn>
      <CenteredFlex flexDirection="column">
        <Head><title>Home</title></Head>
        <Heading mb={6}>Home</Heading>
        <Text>This page is only visible to users with a profile in the database.</Text>
        <Text>If there is no profile, you will be redirected to the /welcome page.</Text>
        <Text mb={6}>Your display name: {profileHandler().profileInfo?.displayName}</Text>
      </CenteredFlex>
    </FadeIn>
  )
})

export default Home