import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    if (nweet === "") {
      return;
    }
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>

      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>

      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
