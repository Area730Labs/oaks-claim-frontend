
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SolflareWalletAdapter,PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { 
  Flex, 
  Spacer ,
  Center,
  Text,
  Box,
  VStack,
  Button, 
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Image,
} from '@chakra-ui/react'
import '@fontsource/open-sans/700.css'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export default function DropList() {
    const { publicKey, signMessage } = useWallet();


    return (
        <>
        {publicKey && (
                  <VStack marginTop='40px'>
                    <Flex backgroundColor='#f7f7f7' padding='10px' borderRadius='10px' minW='320px' maxW='400px' gap='10px' w='100%'>
                      <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />
                      
                      <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>

                      <Center><Text fontSize='18px' fontWeight='bold'>145.5</Text></Center>
                      
                      <Spacer/>
                      <Button colorScheme='blue' variant='outline'>
                        Claim
                      </Button>
                    </Flex>



                    <Flex backgroundColor='#f7f7f7' padding='10px' borderRadius='10px' minW='320px' maxW='400px' gap='10px' w='100%'>
                      <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />
                      
                      <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>

                      <Center><Text fontSize='18px' fontWeight='bold'>145.5</Text></Center>
                      
                      <Spacer/>
                      <Button colorScheme='blue' variant='outline'>
                        Claim
                      </Button>
                    </Flex>


                    <Flex backgroundColor='#f7f7f7' padding='10px' borderRadius='10px' minW='320px' maxW='400px' gap='10px' w='100%'>
                      <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />
                      
                      <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>

                      <Center><Text fontSize='18px' fontWeight='bold'>145.5</Text></Center>
                      
                      <Spacer/>
                      <Button colorScheme='blue' variant='outline'>
                        Claim
                      </Button>
                    </Flex>


                    <Flex backgroundColor='#f7f7f7' padding='10px' borderRadius='10px' minW='320px' maxW='400px' gap='10px' w='100%'>
                      <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />
                      
                      <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>

                      <Center><Text fontSize='18px' fontWeight='bold'>145.5</Text></Center>
                      
                      <Spacer/>
                      <Button colorScheme='blue' variant='outline'>
                        Claim
                      </Button>
                    </Flex>


                    <Flex backgroundColor='#f7f7f7' padding='10px' borderRadius='10px' minW='320px' maxW='400px' gap='10px' w='100%'>
                      <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />
                      
                      <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>

                      <Center><Text fontSize='18px' fontWeight='bold'>145.5</Text></Center>
                      
                      <Spacer/>
                      <Button colorScheme='blue' variant='outline'>
                        Claim
                      </Button>
                    </Flex>


                    <Flex backgroundColor='#f7f7f7' padding='10px' borderRadius='10px' minW='320px' maxW='400px' gap='10px' w='100%'>
                      <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />
                      
                      <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>

                      <Center><Text fontSize='18px' fontWeight='bold'>145.5</Text></Center>
                      
                      <Spacer/>
                      <Button colorScheme='blue' variant='outline'>
                        Claim
                      </Button>
                    </Flex>


                    <Flex backgroundColor='#f7f7f7' padding='10px' borderRadius='10px' minW='320px' maxW='400px' gap='10px' w='100%'>
                      <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />
                      
                      <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>

                      <Center><Text fontSize='18px' fontWeight='bold'>145.5</Text></Center>
                      
                      <Spacer/>
                      <Button colorScheme='blue' variant='outline'>
                        Claim
                      </Button>
                    </Flex>


                    


                    
                  </VStack>
                )}
        </>
    );
}