import {createContext, useState} from "react";

// TODO: Maybe remove

const UserInfo = createContext(null);

const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({name: null})
    return <UserInfo.Provider value = {{ userInfo, setUserInfo }}>
        {children}
    </UserInfo.Provider>
}
