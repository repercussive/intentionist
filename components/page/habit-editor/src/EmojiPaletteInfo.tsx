import { ModalPopup } from '@/components/app'
import { InfoIcon } from '@/components/icons'
import { Box, Button, Flex, Heading, IconButton, Text } from '@/components/primitives'
import { useState } from 'react'
import NextImage from 'next/image'
import quickPaletteExample from '@/public/images/quickpalette.png'

const EmojiPaletteInfo = () => {
  const [showModal, setShowModal] = useState(false)

  function openModal() {
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
  }

  return (
    <>
      <IconButton onClick={openModal} icon={InfoIcon} sx={{ p: '0.7rem', bg: 'transparent' }} />
      <ModalPopup isOpen={showModal} closeModal={closeModal}>
        <Flex center column>
          <Heading level={2} sx={{ my: 6 }}>Quick palette</Heading>
          <Box sx={{ px: 4, pb: 4 }}>
            <Box sx={{
              maxWidth: '400px',
              bg: 'whiteAlpha.5',
              borderRadius: 'default',
              p: 4,
              fontWeight: 'light',
              textAlign: 'center',
              lineHeight: 1.5,
              'img': { borderRadius: 'default' }
            }}>
              <Text sx={{ mb: 4 }}>
                Every day, you can choose one or more emojis to represent the status of this habit.{' '}
                Use the quick palette for easy access to emojis that you will commonly use.
              </Text>
              <NextImage
                src={quickPaletteExample}
                width={648}
                height={455}
                placeholder="blur"
                alt="An example of the quick palette being used for an exercise habit"
              />
            </Box>
          </Box>
        </Flex>
      </ModalPopup>
    </>
  )
}

export default EmojiPaletteInfo