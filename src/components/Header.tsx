import { Box, Flex, Heading } from "@chakra-ui/react";



const Header = () => {
    return(
        <Box as="header" bg="gray" p={4} boxShadow="sm">
            <Flex justifyContent='space-between' alignItems="center">
                <Heading size="md">My Task App Logo & Name</Heading>
                
            </Flex>
            
        </Box>
    )
}

export default Header;