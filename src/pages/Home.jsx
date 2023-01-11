import { populateLizardCollection, numReadsFirstTimeUser } from "../utils/functions";

export default function Home() {
    return (
        <div>
            <h1>Home component!</h1>
            <button onClick={() => populateLizardCollection()}>populateLizardCollection!</button>
            <button onClick={() => numReadsFirstTimeUser()}>numReadsFirstTimeUser</button>
        </div>
    );
}
