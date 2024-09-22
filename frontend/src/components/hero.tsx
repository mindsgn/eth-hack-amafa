'use client';

import React from 'react';
import { Box, Heading, Text, Container } from '@chakra-ui/react';
import { PlatformButton } from './platformButton';

export type HeroProp = {};

function Hero({}: HeroProp) {
  return (
    <Box
      display={'flex'}
      flexDir={['column', 'column', 'row', 'row']}
      justifyContent={['center', 'center', 'center', 'center']}
      alignItems={['center', 'center', 'center', 'center']}
      padding={5}
      paddingTop={100}
      position={'relative'}
    >
      <Box width={['100%', '100%', '60%', '50%']}>
      <Container
          background={'black'}
          paddingY={10}
          display={'flex'}
          flexDir={'column'}
        >
        <Heading
          marginY={2}
          color="white"
          fontFamily="heavy"
          cursor={'pointer'}
          textAlign={'left'}
        >
          {`Everything you need to manage & track your assets`}
        </Heading>
      </Container>
        <Text
          display={["none","none","none", "none"]}
          marginY={4}
          fontFamily="heavy"
          cursor="pointer"
          color="gray"
        >
          {'Amafa is a modern, asset management software that lets you create, manage, assign and overview your assets and equipment. From small office equipment to construction cranes.'}
        </Text>
        <Box display={'none'} flexDir={'row'} flexWrap={'wrap'}>
          <PlatformButton image={'/google.png'} />
          <PlatformButton image={'/ios.png'} />
        </Box>
      </Box>
  </Box>
);
}

export { Hero };
