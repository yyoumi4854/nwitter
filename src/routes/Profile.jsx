import { authService, dbService } from "fbase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj }) => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyNweets = async () => {
    // 기본적으로 필터링할 수 있는 방법
    // -> 어떻게 필터링할지, 어떤 순서로 필터링 할지 내가 원하는 만큼 (쿼리를) 엮을 수 있다.
    // where은 필터링하는 방법을 알려준다.
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "dosc") // 내림차순
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
