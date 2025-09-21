import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
 createUserWithEmailAndPassword,
 EmailAuthProvider,
 reauthenticateWithCredential,
 sendPasswordResetEmail,
 signInWithEmailAndPassword,
 updatePassword,
 type User,
} from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import type { TaskData } from "../types/taskData";
import { auth, db } from "../utils/firebase";


type UseFirebase = () => {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    tasks: TaskData[];
    setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>
    fetchDb: (data: string) => Promise<void>
    calculateTotalTaskCount: () => number
    updateDb: (data: TaskData) => Promise<void>
    entryDb: (data: TaskData) => Promise<void>;
    deleteDb: (data: TaskData) => Promise<void>
    handleLogout: () => Promise<void>
    passwordConf: string
    setPasswordConf: React.Dispatch<React.SetStateAction<string>>
    handleSignup: (e: React.FormEvent) => Promise<void>
    currentPassword: string;
    setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
    handleUpdatePassword: (e: React.FormEvent) => Promise<void>;
    handleResetPassword: (e: React.FormEvent) => Promise<void>;
}

export const useFirebase: UseFirebase =() => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [currentPassword, setCurrentPassword] = useState("");
    const [user, setUser] = useState<User | null>(null); 
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const navigate = useNavigate()
    const toast = useToast()



    ////Authentication
    //ログイン処理
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userLogin = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logined", userLogin);
            toast({
                title: 'ログインしました',
                position: 'top',
                status: 'success',
                duration: 2000,
                isClosable: true,
           })
           navigate('/')
        }
        catch (error) {
            console.error("Error during sign up:", error);
            toast({
                title: 'ログインに失敗しました',
                description: `${error}`,
                position: 'top',
                status: 'error',
                 duration: 2000,
                isClosable: true,
           })
        }
        finally {
            setLoading(false);
        }
    };

    //ユーザーセッション状態の判定処理
    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((user:User | null) => {
            setUser(user);
            if(user) {
                setEmail(user.email as string);
            }else {
                const authNotRequiredPaths = ["/login", "/register", "/sendReset"];
                const currentPath = window.location.pathname;

                if(!authNotRequiredPaths.includes(currentPath)){
                    navigate("/login");
                }
            }
        });
        return () => {
            unsubscribed();
        };
    },[user]);



    //：ログアウト処理
    const handleLogout = async () => {
       setLoading(true);
       try {
           const usertLogout = await auth.signOut();
           console.log("User Logout:", usertLogout);
           toast({
               title: 'ログアウトしました',
               position: 'top',
               status: 'success',
               duration: 2000,
               isClosable: true,
           })
           navigate('/login');
       }
       catch (error) {
           console.error("Error during logout:", error);
           toast({
               title: 'ログアウトに失敗しました',
               description: `${error}`,
               position: 'top',
               status: 'error',
               duration: 4000,
               isClosable: true,
           })
       }
       finally {
           setLoading(false);
       }
   }


     //追加：サインアップ処理
    const handleSignup = async (e: React.FormEvent) => {
       e.preventDefault();

       if (password !== passwordConf) {
           toast({
               title: 'パスワードが一致しません',
               position: 'top',
               status: 'error',
               duration: 2000,
               isClosable: true,
           })
           return;
       } else if (password.length < 6) {
           toast({
               title: 'パスワードは6文字以上にしてください',
               position: 'top',
               status: 'error',
               duration: 2000,
               isClosable: true,
           })
           return;
       }

       try {
           setLoading(true);
           // Firebaseにユーザーを作成する処理
           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           console.log("User created:", userCredential);
           toast({
               title: 'ユーザー登録が完了しました。',
               position: 'top',
               status: 'success',
               duration: 2000,
               isClosable: true,
           })
           navigate('/');
       }
       catch (error) {
           console.error("Error during sign up:", error);
           toast({
               title: 'サインアップに失敗しました',
               description: `${error}`,
               position: 'top',
               status: 'error',
               duration: 4000,
               isClosable: true,
           })
       }
       finally {
           setLoading(false);
       }
   }

    //パスワード変更
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConf) {
            toast({
            title: "パスワードが一致しません",
            position: "top",
            status: "error",
            duration: 2000,
            isClosable: true,
            });
            return;
        } else if (password.length < 6) {
            toast({
            title: "パスワードは6文字以上にしてください",
            position: "top",
            status: "error",
            duration: 2000,
            isClosable: true,
            });
            return;
        }
        try {
            //パスワードの更新はユーザの再認証が必要
            setLoading(true);
            if (user) {
            // 再認証のために、ユーザーの認証情報を取得
            const credential = EmailAuthProvider.credential(
                user.email!,
                currentPassword // 現在のパスワードを入力
            );

            // 再認証処理
            await reauthenticateWithCredential(user, credential);

            // パスワードの更新処理
            await updatePassword(user, password);
            toast({
                title: "パスワード更新が完了しました",
                position: "top",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            navigate("/"); // updatePasswordが成功した場合にのみページ遷移
            }// eslint-disable-next-line
        } catch (error: any) {
            //
            console.error("Error during password reset:", error);
            toast({
            title: "パスワード更新に失敗しました",
            description: `${error.message}`,
            position: "top",
            status: "error",
            duration: 4000,
            isClosable: true,
            });
        } finally {
            setLoading(false);
        }
        };

    //パスワードリセット申請
        const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // パスワードリセットメール送信
            await sendPasswordResetEmail(auth, email);
            toast({
            title: "パスワード設定メールを確認してください",
            position: "top",
            status: "success",
            duration: 2000,
            isClosable: true,
            });
            navigate("/login"); // sendPasswordResetEmailが成功した場合にのみページ遷移
            // eslint-disable-next-line
        } catch (error: any) {
            //
            console.error("Error during password reset:", error);
            toast({
            title: "パスワード更新に失敗しました",
            description: `${error.message}`,
            position: "top",
            status: "error",
            duration: 2000,
            isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    //Firestore

    //Firestoreデータ取得
    const fetchDb = async (data: string) => {
        setLoading(true);
        try {
            const usersCollectionRef = collection(db, 'users_tasks');
            const q = query(usersCollectionRef, where('email', '==',data));
            const querySnapshot = await getDocs(q);
            const fetchedTasks = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            } as TaskData));
            setTasks(fetchedTasks);
        }
        catch (error) {
            console.error("Error getting documents", error);
        }
        finally {
            setLoading(false);
        }
    }
    
    //Firestoreデータ更新
    const updateDb = async (data: TaskData) => {
       setLoading(true)
       try {
           const userDocumentRef = doc(db, 'users_tasks', data.id);
           await updateDoc(userDocumentRef, {
               taskName: data.taskName,
               priority: data.priority,
               status: data.status,
               taskDescription: data.taskDescription,

           });
           toast({
               title: 'データ更新が完了しました',
               position: 'top',
               status: 'success',
               duration: 2000,
               isClosable: true,
           })
       }
       catch (error) {
           console.log(error)
           toast({
               title: 'データ更新に失敗しました',
               description: `${error}`,
               position: 'top',
               status: 'error',
               duration: 4000,
               isClosable: true,
           })
       } finally {
           setLoading(false)
       }
   }

    //Firestoreデータ新規登録
    const entryDb = async (data: TaskData) => {
       setLoading(true)
       try {
           const usersCollectionRef = collection(db, 'users_tasks');
           const documentRef = await addDoc(usersCollectionRef, {
               taskName: data.taskName,
               priority: data.priority,
               status: data.status,
               taskDescription: data.taskDescription,
               email: email
           });
           console.log(documentRef, data);
           toast({
               title: 'データ登録が完了しました',
               position: 'top',
               status: 'success',
               duration: 2000,
               isClosable: true,
           })
       }
       catch (error) {
           console.error("Error adding document: ", error);
           toast({
               title: 'データ登録に失敗しました',
               description: `${error}`,
               position: 'top',
               status: 'error',
               duration: 4000,
               isClosable: true,
           })
       }
       finally {
           setLoading(false)
       }
   }

    //Firestoreデータ削除
    const deleteDb = async (data: TaskData) => {
       setLoading(true);
       try {
           const userDocumentRef = doc(db, 'users_tasks', data.id);
           await deleteDoc(userDocumentRef);
           toast({
               title: 'データを削除しました',
               position: 'top',
               status: 'success',
               duration: 2000,
               isClosable: true,
           })
       }
       catch (error) {
           console.error("Error during delete:", error);
           toast({
               title: 'デー削除に失敗しました',
               description: `${error}`,
               position: 'top',
               status: 'error',
               duration: 4000,
               isClosable: true,
           })
       }
       finally {
           setLoading(false);
       }
   }


    //タスク個数
    const calculateTotalTaskCount = () => {
        return tasks.reduce((count) => count +1,0);
    };
    

    return {
        loading,
        setLoading,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        user,
        setUser,
        tasks,
        setTasks,
        fetchDb,
        calculateTotalTaskCount,
        updateDb,
        entryDb,
        deleteDb,
        handleLogout,
        passwordConf,
        setPasswordConf,
        handleSignup,
        currentPassword, 
        setCurrentPassword, 
        handleUpdatePassword, 
        handleResetPassword,
    };
};