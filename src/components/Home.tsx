import { useEffect, useRef, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import {
 AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent,
 AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
 Box, Button, Card, CardBody, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody,
 ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack,
 Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useFirebase } from "../hooks/useFirebase";
import type { TaskData } from "../types/taskData";

const Home = () => {
 const { loading, user, email, tasks, fetchDb, calculateTotalTaskCount, updateDb, entryDb, deleteDb, handleLogout  } =
   useFirebase(); 
 const modalEdit = useDisclosure()
 const modalEntry = useDisclosure()
 const modalDelete = useDisclosure()
 const alertLogout = useDisclosure()
 const initialRef = useRef(null)
 const cancelRef = useRef(null)
 const [editTask, setEditTask] = useState<TaskData>({//タスクの登録・更新・削除用のstate
   id: '',
   taskName: '',
   priority: '',
   status: '',
   taskDescription: ''
 })
  const [entryTask, setEntryTask] = useState<TaskData>({
   id: '',
   taskName: '',
   priority: '',
   status: '',
   taskDescription: ''
 })
   const [deleteTask, setDeleteTask] = useState<TaskData>({
   id: '',
   taskName: '',
   priority: '',
   status: '',
   taskDescription: ''
 })
 
 const toast = useToast()
 const navigate = useNavigate()

 useEffect(() => {
   //useEffect追加
   if (user) {
     //ユーザーがセッション中であれば、
     fetchDb(email); //emailをキーに、FirestoreDBをフェッチ、データを取得
     console.log("Firestore", email); //コンソールログ出力
   }
 }, [user]); // userが更新された時に実行

  const handleUpdate = async () => {//追加：クリック時、DBデータ更新し、その後、更新反映されたDBデータを取得、ローディングが解除されたら、モーダルクローズ
   await updateDb(editTask);
   fetchDb(email)
   if (!loading) {
     setTimeout(() => {
       modalEdit.onClose();
     }, 500);
   }
 }

  const handleEntry = async () => {//追加：クリック時、入力データの新規登録、もしくは既存データの更新を実施
   if (tasks.some((l) => l.taskName === entryTask.taskName)) {
     const existingTask = tasks.find((l) => l.taskName === entryTask.taskName);
     if (existingTask) {
       //existingTask.time += entryTask.time;
       await updateDb(existingTask);
     }
   } else {
     await entryDb(entryTask);
   }
   fetchDb(email)
   setEntryTask({ id: "", taskName: "", priority: "",status: "",taskDescription: "", })
   if (!loading) {
     setTimeout(() => {
       modalEntry.onClose()
     }, 500);
   }
 };

  const handleDelete = async () => {//追加：クリック時、入力データの新規登録、もしくは既存データの更新を実施
   await deleteDb(deleteTask);
   fetchDb(email)
   if (!loading) {
     setTimeout(() => {
       modalDelete.onClose();
     }, 500);
   }
 }


 return (
   <>
     <Flex alignItems="center" justify="center" p={5}>
       <Card size={{ base: "sm", md: "lg" }}>
         <Box textAlign="center" mb={2} mt={10}>
           {/*ようこそ！ test@test.com さんを、下記に変更*/}
           ようこそ！{email} さん
         </Box>
         <Heading size="md" textAlign="center">
           ToDoアプリ
         </Heading>
         <CardBody>
           <Box textAlign="center">
           <Box p={5}>
             {}
             <div>タスク総数：{calculateTotalTaskCount()}個</div>
           </Box>
             {
               loading && (
                 <Box p={10}>
                   <Spinner />
                 </Box>
                ) //追加、ローティング中であれば<Spinner />を表示
             }
             <TableContainer>
               <Table variant="simple" size={{ base: "sm", md: "lg" }}>
                 <Thead>
                   <Tr>
                     <Th>タスク</Th>
                     <Th>優先度</Th>
                     <Th>状態</Th>
                     <Th>タスク内容</Th>
                   </Tr>
                 </Thead>
                 <Tbody>
                   {tasks.map((task, index) => (
                     //mapメソッドでtasksのタイトルと時間を各々表示
                     <Tr key={index}>
                       <Td>{task.taskName}</Td>
                       <Td>{task.priority}</Td>
                       <Td>{task.status}</Td>
                       <Td>{task.taskDescription}</Td>
                       <Td>

                         {/* 追加：編集用モーダルここから */}
                         <Button variant='ghost' onClick={() => {
                           setEditTask(task)
                           modalEdit.onOpen()
                         }}><FiEdit color='black' /></Button>

                         <Modal
                           initialFocusRef={initialRef}
                           isOpen={modalEdit.isOpen}
                           onClose={modalEdit.onClose}
                         >
                           <ModalOverlay />
                           <ModalContent>
                             <ModalHeader>タスク編集</ModalHeader>
                             <ModalCloseButton />
                             <ModalBody pb={6}>
                               <FormControl>
                                 <FormLabel>タスク名</FormLabel>
                                 <Input
                                   ref={initialRef}
                                   placeholder='タスク名'
                                   name='taskName'
                                   value={editTask.taskName}
                                   onChange={(e) => {
                                     setEditTask({ ...editTask, taskName: e.target.value })
                                   }}
                                 />
                               </FormControl>

                               <FormControl mt={4}>
                                 <FormLabel>優先順位</FormLabel>
                                 <Input
                                   placeholder='優先順位'
                                   name='priority'
                                   value={editTask.priority}
                                   onChange={(e) => {
                                     setEditTask({ ...editTask, priority: String(e.target.value) })
                                   }}
                                 />
                               </FormControl>
                               <FormControl mt={4}>
                                 <FormLabel>状態</FormLabel>
                                 <Input
                                   placeholder='状態'
                                   name='status'
                                   value={editTask.status}
                                   onChange={(e) => {
                                     setEditTask({ ...editTask, status: String(e.target.value) })
                                   }}
                                 />
                               </FormControl>
                               <FormControl mt={4}>
                                 <FormLabel>タスク内容</FormLabel>
                                 <Input
                                   placeholder='タスク内容'
                                   name='taskDescription'
                                   value={editTask.taskDescription}
                                   onChange={(e) => {
                                     setEditTask({ ...editTask, taskDescription: String(e.target.value) })
                                   }}
                                 />
                               </FormControl>
                               <div>入力されているタスク名：{editTask.taskName}</div>
                               <div>入力されている優先順位：{editTask.priority}</div>
                               <div>入力されている状態：{editTask.status}</div>
                               <div>入力されているタスク内容：{editTask.taskDescription}</div>
                             </ModalBody>
                             <ModalFooter>
                               <Button
                                 isLoading={loading}
                                 loadingText='Loading'
                                 spinnerPlacement='start'
                                 colorScheme='green'
                                 mr={3}
                                 onClick={() => {
                                   if (editTask.taskName !== "") {
                                     handleUpdate()
                                   }
                                   else {
                                     toast({
                                       title: 'タスク名を入力してください',
                                       position: 'top',
                                       status: 'error',
                                       duration: 2000,
                                       isClosable: true,
                                     })
                                   }

                                 }}
                               >
                                 データを更新
                               </Button>
                               <Button onClick={() => {
                                 modalEdit.onClose()
                               }}>Cancel</Button>
                             </ModalFooter>
                           </ModalContent>
                         </Modal>
                         {/* 編集用モーダルここまで */}


                       </Td>
                       <Td>

                        {/* 追加：削除用モーダルここから */}
                         <Button variant='ghost'
                           onClick={() => {
                             setDeleteTask(task)
                             modalDelete.onOpen()
                           }}><MdDelete color='black' /></Button>
                         <Modal
                           isOpen={modalDelete.isOpen}
                           onClose={modalDelete.onClose}
                         >
                           <ModalOverlay />
                           <ModalContent>
                             <ModalHeader>データ削除</ModalHeader>
                             <ModalCloseButton />
                             <ModalBody pb={6}>
                               <Box>
                                 以下のデータを削除します。<br />
                                 タスク名：{deleteTask.taskName}、優先順位:{deleteTask.priority}、状態:{deleteTask.status}、タスク内容:{deleteTask.taskDescription}
                               </Box>
                             </ModalBody>
                             <ModalFooter>
                               <Button onClick={modalDelete.onClose} mr={3}>Cancel</Button>
                               <Button
                                 isLoading={loading}
                                 loadingText='Loading'
                                 spinnerPlacement='start'
                                 ref={initialRef}
                                 colorScheme='red'
                                 onClick={handleDelete}
                               >
                                 削除
                               </Button>
                             </ModalFooter>
                           </ModalContent>
                         </Modal>
                         {/* 削除用モーダルここまで */}

                       </Td>
                     </Tr>
                   ))}
                 </Tbody>
               </Table>
             </TableContainer>
           </Box>



           {/* 新規登録モーダルここから */}
           <Box p={25}>
             <Stack spacing={3}>
               <Button
                 colorScheme='green'
                 variant='outline'
                 onClick={modalEntry.onOpen}>
                 新規データ登録
               </Button>
             </Stack>
             <Modal
               initialFocusRef={initialRef}
               isOpen={modalEntry.isOpen}
               onClose={modalEntry.onClose}
             >
               <ModalOverlay />
               <ModalContent>
                 <ModalHeader>新規データ登録</ModalHeader>
                 <ModalCloseButton />
                 <ModalBody pb={6}>
                   <FormControl>
                     <FormLabel>タスク名</FormLabel>
                     <Input
                       ref={initialRef}
                       name='newEntrytaskName'
                       placeholder='タスク名'
                       value={entryTask.taskName}
                       onChange={(e) => {
                         setEntryTask({ ...entryTask, taskName: e.target.value })
                       }}
                     />
                   </FormControl>
                   <FormControl mt={4}>
                     <FormLabel>優先順位
                     </FormLabel>
                     <Input
                       name='newEntryPriority'
                       placeholder='優先順位'
                       value={entryTask.priority}
                       onChange={(e) => {
                         setEntryTask({ ...entryTask, priority: String(e.target.value) })
                       }}
                     />
                   </FormControl>
                   <FormControl mt={4}>
                     <FormLabel>状態
                     </FormLabel>
                     <Input
                       name='newEntryStatus'
                       placeholder='状態'
                       value={entryTask.status}
                       onChange={(e) => {
                         setEntryTask({ ...entryTask, status: String(e.target.value) })
                       }}
                     />
                   </FormControl>
                   <FormControl mt={4}>
                     <FormLabel>タスク内容
                     </FormLabel>
                     <Input
                       name='newEntryTaskDescription'
                       placeholder='タスク内容'
                       value={entryTask.taskDescription}
                       onChange={(e) => {
                         setEntryTask({ ...entryTask, taskDescription: String(e.target.value) })
                       }}
                     />
                   </FormControl>
                   <div>入力されているタスク名：{entryTask.taskName}</div>
                   <div>入力されている優先順位：{entryTask.priority}</div>
                   <div>入力されている状態：{entryTask.status}</div>
                   <div>入力されているタスク内容：{entryTask.taskDescription}</div>
                 </ModalBody>
                 <ModalFooter>
                   <Button
                     isLoading={loading}
                     loadingText='Loading'
                     spinnerPlacement='start'
                     colorScheme='green'
                     mr={3}
                     onClick={() => {
                       if (entryTask.taskName !== "") {
                         handleEntry()
                       }
                       else {
                         toast({
                           title: 'タスク名前を入力してください',
                           position: 'top',
                           status: 'error',
                           duration: 2000,
                           isClosable: true,
                         })
                       }
                     }}
                   >
                     登録
                   </Button>
                   <Button onClick={() => {
                     modalEntry.onClose()
                   }}>Cancel</Button>
                 </ModalFooter>
               </ModalContent>
             </Modal>
           </Box>
           {/* 新規登録モーダルここまで */}

           {/*ログアウトアラートここから*/ }
           <Box px={25} mb={4}>
             <Stack spacing={3}>
               <Button
                 width='100%'
                 variant='outline'
                 onClick={alertLogout.onOpen}>ログアウト</Button>
               <AlertDialog
                 motionPreset='slideInBottom'
                 leastDestructiveRef={cancelRef}
                 onClose={alertLogout.onClose}
                 isOpen={alertLogout.isOpen}
                 isCentered
               >
                 <AlertDialogOverlay />
                 <AlertDialogContent>
                   <AlertDialogHeader>ログアウト</AlertDialogHeader>
                   <AlertDialogCloseButton />
                   <AlertDialogBody>
                     ログアウトしますか?
                   </AlertDialogBody>
                   <AlertDialogFooter>
                     <Button ref={cancelRef} onClick={alertLogout.onClose}>
                       Cancel
                     </Button>
                     <Button isLoading={loading}
                       loadingText='Loading'
                       spinnerPlacement='start'
                       colorScheme='red' ml={3}
                       onClick={handleLogout}>
                       ログアウト</Button>
                   </AlertDialogFooter>
                 </AlertDialogContent>
               </AlertDialog>
             </Stack>
           </Box>
           {/*ログアウトアラートここまで*/}

           <Box px={25} mb={4}>
             <Stack spacing={3}>
               <Button width="100%" variant="outline"  onClick={() => navigate("/updatePassword")}>
                 パスワード更新
               </Button>
             </Stack>
           </Box>
         </CardBody>
       </Card>
     </Flex>
   </>
 );
};
export default Home;