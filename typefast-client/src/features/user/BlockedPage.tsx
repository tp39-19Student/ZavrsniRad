import { use } from "react";
import type { User } from "./usersSlice";


export default function BlockedPage({user}: {user:User}) {
     

    return (
        <div className="center">
            <div className="w-50">
                <table className="table">
                    <tbody>
                        <tr>
                            <td colSpan={2}>
                                <h1>You have been blocked</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>Blocked until:</td>
                            <td>{new Date(user.blUntil * 1000).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Block reason:</td>
                            <td>
                                <textarea readOnly rows={6} className="form-control" value={user.blReason.length > 0? user.blReason : "No reason given"}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}