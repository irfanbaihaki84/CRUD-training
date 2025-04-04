import './App.css';
import Signin from './components/Signin.jsx';
import UserList from './components/UserList.jsx';

function App() {
  return (
    <>
      <div className="container">
        <h2>SELAMAT DATANG DI USER INTERFACE.</h2>
        <Signin />
        <UserList />
      </div>
    </>
  );
}

export default App;
