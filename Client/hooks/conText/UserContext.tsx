import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { GetUserBank, resultObject } from "../auth/GetUserBank";
import { ServerContext } from "../conText/ServerConText";

type UserTransaction = {
  id: number;
  user_id: number;
  account_id: number;
  split_payment_id : number;
  transaction_name : string;
  amount : number;
  transaction_type : "income" | "expense";
  transaction_date : string;
  note : string;
  color_code : string;
}


type UserNotification = {
  id: number;
  mode: string;
  Header: string;
  Description: string;

type UserRetire = {
  id: number;
  user_id: number;
  monthly_savings_goal : number;
  total_savings_goal: number;
  current_savings: number;

type UserContextType = {
  fullname: string | null;
  username: string | null;
  userID: number | null;
  email: string | null;
  bank: Array<resultObject> | null;
  birthdate: string | null;
  transaction: Array<UserTransaction> | null;
  notification: Array<UserNotification> | null;
  retire: Array<UserRetire> | null;
  setUsername: (user: string) => void;
  setUserID: (id: number) => void;
  setEmail: (email: string) => void;
  setFullname: (name: string) => void;
  setBirthdate: (birthdate: string) => void;
  setTransaction: (transaction: Array<UserTransaction>) => void;
  setNotification: (transaction: Array<UserNotification>) => void;
  setBank: (bank: Array<resultObject>) => void;
  setRetire: (retire: Array<UserRetire>) => void;
  loading: boolean;
};

export const UserContext = React.createContext<UserContextType>({
  fullname: null,
  username: null,
  userID: null,
  email: null,
  bank: null,
  birthdate: null,
  transaction: null,
  notification: null,
  retire: null,

  
  setUsername: () => {},
  setUserID: () => {},
  setEmail: () => {},
  setFullname: () => {},
  setBirthdate: () => {},
  setTransaction: () => {},
  setNotification: () => {},
  setBank: () => {},
  setRetire: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const { URL } = useContext(ServerContext);

  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userID, setUserID] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string | null>(null);
  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [bank, setBank] = useState<Array<resultObject> | null>(null);
  const [transaction, setTransaction] = useState<Array<UserTransaction> | null>(null);
  const [notification, setNotification] = useState<Array<UserNotification> | null>(null);
  const [retire, setRetire] = useState<Array<UserRetire> | null>(null);

  useEffect(() => {
    if (auth?.token) {
      const decoded = auth.decodeToken(auth.token);
      setUsername(decoded.username);
      setUserID(decoded.UserID);
      setEmail(decoded.email);
      setLoading(false);

      GetUserBank(URL, userID!, auth.token)
        .then((response) => {
          if (response.success) {
            setBank(response.result);
            // console.log(response.result);
          } else {
            console.log(response.message);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [auth?.token, userID]);

  useEffect(() => {
    if (userID && auth?.token) {
      axios
        .get(`${URL}/users/${userID}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((response) => {
          // console.log("fullname1:", response.data);
          setFullname(response.data.name);
          // console.log("Fullname: ", response.data.name);
        })
        .catch((error) => {
          console.log(error.message);
        });
      axios
        .get(`${URL}/transactions/${userID}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((response) => {
          setTransaction(response.data.result);
          console.log("Transaction: ", response.data.result);
        }).catch((error) => {
          console.log(error.message);
        });
    }
  }, [fullname, userID, auth?.token]);

  return (
    <UserContext.Provider
      value={{
        fullname,
        username,
        userID,
        email,
        bank,
        birthdate,
        transaction,
        notification,
        retire,
        setUsername,
        setEmail,
        setUserID,
        setFullname,
        setBirthdate,
        setTransaction,
        setNotification,
        setBank,
        setRetire,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
