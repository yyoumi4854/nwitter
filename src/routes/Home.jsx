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

import { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

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

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
