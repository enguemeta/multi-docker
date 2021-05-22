import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import otherPage from './other-page';
import Fib from './Fib';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <h1>Fib calculator</h1>
          <Link to='/'>Home</Link>
          <Link to='/otherPage'>Other Page</Link>
        </header>
        <div>
          <Route exact path='/' component={Fib}></Route>
          <Route path='/otherpage' component={otherPage}></Route>
        </div>
      </div>
    </Router>
  );
}

export default App;
