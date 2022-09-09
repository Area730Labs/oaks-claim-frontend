import { 
    Container,
    Flex, 
    Box, 
    Text,
    Spacer,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Spinner,
} from '@chakra-ui/react'
import {
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { API_URL } from '../config';



//@ts-ignore
export default function Login(props) {
    const { publicKey, signMessage } = useWallet();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onLoginHandler = async () => {
        onOpen();

        if (!signMessage || !publicKey) {
            onClose();
            return;
        }

        try {    
            const message = new TextEncoder().encode('I am admin');
            const signature = await signMessage(message);
            const base64str = Buffer.from(signature).toString('base64');

            const payload = {
                'wallet': publicKey.toString(),
                'signature': base64str
            };

            const res = await (await fetch(`${API_URL}/oaks_airdrop_login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })).json();

            if (Object.hasOwn(res, 'error')) {
                alert('Failed to log in');
            } else {
                props.onLoggedIn(res);
            }
        } catch (error) {
            alert('Operation failed');
        } finally {
            onClose();
        }
    };

    return (
        <>
         <Modal onClose={() => {}} isOpen={isOpen} isCentered size='xs'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Loading...</ModalHeader>

                <ModalBody textAlign="center">
                    <Spinner />
                </ModalBody>
            </ModalContent>
        </Modal>
        
        <Container maxW="500px" marginTop="200px" backgroundColor="#FBFBFB" borderRadius="10px" paddingTop="25px" minH="100px" textAlign="center">
           <Flex>
                <Text fontSize="22px" lineHeight='48px' fontWeight='bold' marginRight="50px" marginLeft="40px">1. Log in:</Text>
                <Spacer />
                <WalletMultiButton style={{margin: 'auto'}}/>
           </Flex>

           
            {publicKey && (
                <Flex marginTop='20px' paddingBottom='25px'>
                    <Text fontSize="22px" lineHeight='48px' fontWeight='bold' marginRight="50px" marginLeft="40px">2. Sign message:</Text>
                    <Spacer />

                    <Button colorScheme='teal' size='md' height='48px' marginRight='50px' onClick={onLoginHandler}>
                        Sign
                    </Button>
                </Flex>
            )}

        </Container>
       </>
    );
}