'use client';

import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Hero } from './hero';
import { Footer } from './footer';
import { MainContent } from './mainContent';
import { FAQ } from './faq';

export type MainProp = {};

function Main({}: MainProp) {
  return (
    <Box>
      <Hero />
      <MainContent />
      <FAQ />
      <Footer />
    </Box>
  );
}

export { Main };
