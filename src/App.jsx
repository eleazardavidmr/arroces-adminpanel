import Login from "./Components/Login";
import Main from "./Components/Main";
import { useContext } from "react";
import { ProductContext } from "./Components/Context";
function App() {
  const context = useContext(ProductContext);
  if (!context.isLoggedIn) {
    return <Login />;
  }
  return (
    <>
      <Main />
    </>
  );
}

export default App;
