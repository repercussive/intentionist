import { observer } from 'mobx-react-lite'
import Text from '@/components/primitives/Text'
import NextLink from 'next/link'

const About = observer(() => {
  return (
    <Text>
      Created by{' '}
      <NextLink href="https://github.com/repercussive" passHref>
        <a sx={{ color: 'textAccent' }}>
          Liam Robertson
        </a>
      </NextLink>
      .
    </Text>
  )
})

export default About