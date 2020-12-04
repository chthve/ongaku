import React from 'react';
import './styles/App.scss';
import { Route, Switch } from 'react-router-dom';
import Createpost from './components/CreatePost/createPost';
import Finalcreatepost from './components/CreatePost/FinalCreatePost/FinalCreatePost';

import Dashboard from './components/Dashboard/Dashboard';
import Discover from './components/Discover/Discover';
import Home from './components/Home/Home';
import Authenticated from './components/Authenticated/Authenticated';
import Redux from './components/Redux/Redux';
import Postcard from './components/PostCard/Postcard';
import { CheckAuthenticateAndPopulate } from './helpers/checkAuthenticateAndPopulate';

const App: React.FC = () => {
  const isAuthenticated = CheckAuthenticateAndPopulate();
  
  return (
    <Switch>
      <Route
        exact
        path='/search'
        component={Postcard}
      />
      <Route
        exact
        path='/create'
        component={Finalcreatepost}
      />
  
      <Route exact path="/" component={Home} />
      <Route exact path="/authenticated" component={Authenticated} />
      <Route exact path="/discover" component={Discover} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/redux" component={Redux} />
    </Switch>
  );
};

export default App;
