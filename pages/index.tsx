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
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useState } from 'react';
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
  Container,
  Divider,
  Link,
} from '@chakra-ui/react'
import '@fontsource/open-sans/700.css'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import DropList from '../components/DropList';
import { createPlatformConfig } from '../sdk';
import { TxHandler } from '../txhandler';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminButton() {

  const { wallet } = useWallet();
  const {connection} = useConnection();

  const txhandler = useMemo(() => {
    if (wallet != null) {
      return new TxHandler(connection,wallet.adapter);
    } else {
      return null;
    }
  },[wallet,connection])

  const initConfig = () => {

    if (wallet != null) {
      const tx = createPlatformConfig(wallet.adapter);

      txhandler?.sendTransaction([tx]).then((sig) => {
          toast.success(sig)
      });

    } else {
      toast.warn('wallet is not connected');
    }
  }


  return <Button onClick={initConfig}>Init config</Button>
}

const Home: NextPage = () => {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <ToastContainer />
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>

          <Box textAlign='center' minH='100vh' display='flex' flexDirection='column' justifyContent='space-between'>
            <Box>
              <Center width='100%'>
                <Text marginTop='100px' fontSize='50px' textAlign='center'>Claim your airdrops here!</Text>
              </Center>

              <AdminButton />

              <Center marginTop='70px' width='100%'>
                <WalletMultiButton style={{ margin: 'auto' }} />
              </Center>

              <DropList />

            </Box>

            <Container as="footer" role="contentinfo" marginTop='40px' marginBottom='20px'>
              <Link href='https://twitter.com/sol_tracker' isExternal>
                <Text>Made with <span style={{color:"red"}}>♥</span> by SolTracker</Text>
              </Link>

            </Container>
          </Box>


        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Home
