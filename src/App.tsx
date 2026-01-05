import { Toaster } from "sonner";
import "./App.css";
import { UserSearch } from "./components/UserSearch";

function App() {
  return (
    <div className="container">
      <h1>GitHub Finder</h1>
      <UserSearch />
      <Toaster />
    </div>
  );
}

export default App;
