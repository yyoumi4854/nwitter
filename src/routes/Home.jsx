import { useState } from "react";
import { dbService } from "fbase";
import { addDoc, collection } from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");

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
    </div>
  );
};

export default Home;
