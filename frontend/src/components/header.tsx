'use client';

import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

export type HeaderProps = {};

function Header({}: HeaderProps) {
  return (
    <Box
      display="flex"
      position="fixed"
      alignItems="center"
      background="linear-gradient(to bottom, black, rgba(0, 0, 0, 0.1))"
      width="100vw"
      padding={2}
      zIndex={100}
    >
      <Box
        width={10}
        height={10}
        marginX={2}
        backgroundImage="/icon-512.png"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
      />
      <Heading fontFamily="heavy" fontSize={20} color="white" cursor={'pointer'}>
        AMAFA.XYZ
      </Heading>
    </Box>
  );
}

export { Header };