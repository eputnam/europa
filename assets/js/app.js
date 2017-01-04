import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Layout from './pages/Layout'
import Overview from './pages/Overview'
import Repositories from './pages/Repositories'
import RepoDetailsPage from './pages/RepoDetailsPage'
import AddRepo from './pages/AddRepo'
import Settings from './pages/Settings'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={Layout}>
          <Route component={Repositories} path="/" />
          <Route component={RepoDetailsPage} path="/repository/:repoId" />
          <Route component={AddRepo} path="/new-repository" />
          <Route component={Settings} path="/settings" />
        </Route>
      </Router>
    );
  }
}

window.MyApp = {
  init: function (opts) {
    var mountPoint = opts.mount;
    var config = opts.props;
    ReactDOM.render(React.createFactory(App)(config), document.getElementById(mountPoint));
  }
};
