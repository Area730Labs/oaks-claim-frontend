
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import {
  Flex,
  Spacer,
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
import Api, { Drop } from '../api';
import { toast } from 'react-toastify';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

function toFloat(value: number): number {

  const max = 10000000;

  return Math.round(value / LAMPORTS_PER_SOL * max) / max;
}

export default function DropList() {
  const { publicKey, signMessage, connected } = useWallet();
  const [drops, setDrops] = useState<Drop[] | null>(null);
  const api = useMemo(() => {
    return new Api();
  }, []);

  useEffect(() => {

    if (connected && publicKey != null) {
      api.drops(publicKey).then((items) => {
        setDrops(items);
      }).catch((e) => {
        toast.warn("unable to load drops: " + e.message)
      })
    } else {
      setDrops([]);
    }

  }, [connected, publicKey])

  return (
    <>
      {publicKey && (
        <VStack marginTop='40px'>
          {drops?.map((it) => {
            return <DropItem drop={it} />
          })}
        </VStack>
      )}
    </>
  );
}

function DropItem(props: { drop: Drop }) {

  const onClaim = () => {
    
  }

  return <Flex
    cursor="pointer"
    backgroundColor='#f7f7f7'
    padding='10px'
    borderRadius='10px'
    minW='320px'
    maxW='400px'
    gap='10px'
    w='100%'
  >
    <Image borderRadius='full' h='40px' src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' alt='Solana logo' />

    {/* todo use actual drop token*/}
    <Center><Text fontSize='18px' fontWeight='bold'>SOL</Text></Center>
    <Center><Text fontSize='18px' fontWeight='bold'>{toFloat(props.drop.drop_amount)}</Text></Center>

    <Spacer />
    <Button colorScheme='blue' variant='outline' onClick={onClaim}>
      Claim
    </Button>
  </Flex>
}
