import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from "@chakra-ui/react"


const SortableList = () => {
    return(
        <Accordion allowToggle>
         <AccordionItem>
             <h2>
                 <AccordionButton>
                   <Box as='span' flex='1' textAlign='left'>
                    Group 1 
                   </Box>
                  <AccordionIcon />
                 </AccordionButton>
             </h2>
             <AccordionPanel pb={4}>
              Task1 DBの内容を表示
             </AccordionPanel>
         </AccordionItem>
        </Accordion>
    )
}

export default SortableList;