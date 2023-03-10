import "./App.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <h1>Vote dApp</h1>
      <p>Vote Here</p>
      <Button className="m-1">Sync</Button>
      <Button className="m-1" variant="primary">
        Vote
      </Button>
      <Button className="m-1" variant="danger">
        Reset
      </Button>
    </div>
  );
}

export default App;
