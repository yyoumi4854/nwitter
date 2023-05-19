import { useEffect, useState } from "react";
import { dbService } from "fbase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

/**
setNweet(prev => [document.data(), ...prev])
set이 붙는 함수를 쓸 때, 값 대신에 함수를 전달할 수 있다.
그리고 만약 함수를 전달하면, 리액트는 이전 값에 접근할 수 있게 해준다.
dbNweets안에 있는 모든 document에 대해 뭘 하고 있냐면, (setNweet에서)함수를 사용하고 있는데,
리턴하는 것은 implicit return 배열을 리턴한다.
첫번째 배열은 가장 최근 document이고, 그 뒤로 이전 document를 붙인다.
 */

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  // async를 사용하기 위해 개별적인 함수로 만들어줘야 된다.
  const getNweets = async () => {
    const dbNweets = await getDocs(query(collection(dbService, "nweets")));

    dbNweets.forEach((document) => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };

  useEffect(() => {
    getNweets();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // addDoc로 firebase에 데이터 추가 (post 구현)
      // (명시된 데이터를 담은 새로운 document를 collections에 추가 -> document ID를 자동으로 부여)
      const docRef = await addDoc(collection(dbService, "nweets"), {
        nweet,
        createdAt: Date.now(),
      });
      console.log("Document written with ID:", docRef.id);
    } catch (err) {
      console.log("Error adding document:", err);
    }

    setNweet(""); // 입력확인시 입력창 빈값으로
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNweet(value);
  };

  console.log(nweets);

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
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
