import {  auth } from '@lib/firebase';

import firebase from "firebase";
import { useContext ,useRef } from 'react';
import { UserContext } from '@lib/context';
import { useCollection } from 'react-firebase-hooks/firestore';
import Demo from '@components/Demo';

import toast from 'react-hot-toast';
import Replies from './Replies';
// Allows user to heart or like a post
export default function Comments({ postRef }) {

    //
    const name = useRef();
    const { user, username } = useContext(UserContext);
    const [realtimePosts, loading, error] = useCollection(
        postRef.collection('comments').orderBy("timestamp", "desc")
    );




    async function handleSubmit(e) {
        e.preventDefault();
        if (username == null) {
            toast.error("You need to be Logged In!");
            return;
        }
        if (name.current.value == "") {
            toast.error("Not A Valid Comment");
            return;
        }
        const uid = auth.currentUser.uid;
        const da = await postRef.collection('comments').add({
            uid,
            comment: name.current.value,
            username: username,
            photoURL: user?.photoURL || '/hacker.png',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        e.target.reset();
    }

    return (

        <>


            <li className='cardCommentInput p-3 m-3 bg-white'>
                <form onSubmit={handleSubmit}>
                    <input placeholder='Type your views..' className='text-base border-black rounded bg-gray-200 p-3 m-0'  ref={name} />
                    <button className='bg-blue-600 text-white p-3 pr-6 pl-6'  type="submit">Comment</button>
                </form>
            </li>
            <br></br>
            <ul>

                {
                    realtimePosts?.docs.map((doc) => {
                        return (
                            <>
                                <li key={Math.random()} className='ml-3 mr-3    '>

                                    
                                    
                                    <Demo
                                        username={doc.data()?.username}
                                        photoURL={doc.data()?.photoURL || '/hacker.png'}
                                        comment={doc.data()?.comment}
                                        timestamp={doc.data()?.timestamp}
                                        replyFlag = {false}
                                    />
                                    <Replies  currentUser={doc.data()?.username} commentRef={postRef.collection('comments').doc(doc.id)} />
                                </li>
                            </>



                        )
                    })
                }
            </ul>


        </>
    );
}
