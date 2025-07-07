import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchAttendance } from "../../services/api/Api";

const MyAttendance = () => {
  const { studentID } = useContext(AuthContext);
  // const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);



  const GetAttendance = async () => {
    try {
      const res = await fetchAttendance(studentID);
      console.log(res);
      
      setData(res);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    GetAttendance();
  }, [studentID]);

  return (
    <>
    hello
    </>
  );
};

export default MyAttendance;
