import { useParams } from "react-router";


export default function Block() {
    const {id} = useParams();

    return (
        <div>
            <h1>Block {id}</h1>
        </div>
    );
}