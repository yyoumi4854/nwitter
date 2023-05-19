import React from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  return (
    <div>
      <h4>{nweetObj.text}</h4>
      {isOwner && (
        // 현재 회원이 쓴 트윗인지 확인 가능 -> 누가 주인인지 알 수 있음
        <>
          <button>Delete Nweet</button>
          <button>Edit Nweet</button>
        </>
      )}
    </div>
  );
};

export default Nweet;
