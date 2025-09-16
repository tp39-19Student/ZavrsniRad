import { useAppSelector } from "../../hooks";



export default function Profile() {
    const user = useAppSelector(state => state.users.user);

    return (
        <div>
            {user != null?
            <>
                <div>
                    <h1>{user.username}</h1>
                    
                </div>
                <div>Gold: {user.gold}</div>
                <div>Silver: {user.silver}</div>
                <div>Bronze: {user.bronze}</div>
            </>
            :
            <h1>No user loaded</h1>
        }
            
        </div>
    );
};