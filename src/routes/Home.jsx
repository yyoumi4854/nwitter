import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

import Nweet from "components/Nweet";

/**
onSnapshot을 통해 실시간 자동 업데이트를 구현
onSnapshot은 기본적으로 데이터베이스에 무슨일이 있을 때, 알림을 받은것을 의미
새로운 스냅샷을 받을 때 배열을 만들어 state에 배열을 집어 넣는다.
 */

/**
setNweet(prev => [document.data(), ...prev])
set이 붙는 함수를 쓸 때, 값 대신에 함수를 전달할 수 있다.
그리고 만약 함수를 전달하면, 리액트는 이전 값에 접근할 수 있게 해준다.
dbNweets안에 있는 모든 document에 대해 뭘 하고 있냐면, (setNweet에서)함수를 사용하고 있는데,
리턴하는 것은 implicit return 배열을 리턴한다.
첫번째 배열은 가장 최근 document이고, 그 뒤로 이전 document를 붙인다.
 */

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );

    // 데이터 실시간으로 자동 업데이트
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    // addDoc로 firebase에 데이터 추가 (post 구현)
    // (명시된 데이터를 담은 새로운 document를 collections에 추가 -> document ID를 자동으로 부여)
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet(""); // 입력확인시 입력창 빈값으로
    setAttachment("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNweet(value);
  };

  // 이미지 업로드
  // currentTarget.result를 브라우저에 붙여 넣으면 사진을 보여준다.
  // 사진을 선택하면 독특한 형태의 텍스트로 반환시켜줌
  // 그리고 브라우저는 이 텍스트(result)를 사진으로 되돌리는 방법을 알고 있다.
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 1. input에 있는 모든 파일 중에 첫번째 파일만 받도록 하기
    const reader = new FileReader(); // 2. reader를 만들기

    // 3. reader에 event listner를 추가
    // 4. 로딩이 끝날때(일기가 끝날때) finishedEvent를 갖게 된다.
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    // 5. reader.readAsDataURL을 실행 -> 데이터를 얻게 됨 (result 엄청긴 문자열)
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>

      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
