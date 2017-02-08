import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import LoginForm from '../components/LoginForm/LoginForm'
import { LIST_PATH } from 'constants/paths'
<% if (!answers.includeRedux) { %>import firebaseUtil from '../../../utils/firebase'
<% } %>
import classes from './LoginContainer.scss'
<% if (answers.includeRedux) { %>
import { connect } from 'react-redux'
import { UserIsNotAuthenticated } from 'utils/router';
import { firebaseConnect, helpers } from 'react-redux-firebase'
const { isLoaded, isEmpty, pathToJS } = helpers

@UserIsNotAuthenticated // redirect to list page if logged in
@firebaseConnect()
@connect(
  // Map state to props
  ({ firebase }) => ({
    authError: pathToJS(firebase, 'authError')
  })
)<% } %>
export default class Login extends Component {
  <% if (!answers.includeRedux) { %>static contextTypes = {
    router: PropTypes.object
  }<% } %>
<% if (answers.includeRedux) { %>
  static propTypes = {
    firebase: PropTypes.shape({
      login: PropTypes.func.isRequired,
    }),
    authError: PropTypes.shape({
      message: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    }),
  }
<% } %>
  state = {
    snackCanOpen: false
  }

  handleLogin = loginData => {
    this.setState({
      snackCanOpen: true,
      isLoading: true
    })
<% if (!answers.includeRedux) { %>
    const { email, password } = loginData
    if (email && password) {
      firebaseUtil.auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          if (error) {
            console.error('Error logging in:', error)
            newState.errorMessage = error.message || 'Error with login'
          } else {
            console.log('time to redirect or login?', error)
          }
          this.setState({ isLoading: false })
        })
    }<% } %>
    <% if (answers.includeRedux) { %>this.props.firebase.login(loginData)<% } %>
  }

  providerLogin = (provider) =>
    this.handleLogin({ provider, type: 'popup' })

  render () {
    <% if (answers.includeRedux) { %>const { authError } = this.props
    const { snackCanOpen } = this.state

    if (!isLoaded(account) && !isEmpty(account)) {<% } %><% if (!answers.includeRedux) { %>const { snackCanOpen, isLoading, errorMessage } = this.state
    if (isLoading) {<% } %>
      return (
        <div className={classes['container']}>
          <div className={classes['progress']}>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className={classes['container']}>
        <Paper className={classes['panel']}>
          <LoginForm onSubmit={this.handleLogin} />
        </Paper>
        <div className={classes['or']}>
          or
        </div>
        <div className={classes['providers']}>
          <GoogleButton onClick={() => this.providerLogin('google')} />
        </div>
        <div className={classes['signup']}>
          <span className={classes['signup-label']}>
            Need an account?
          </span>
          <Link className={classes['signup-link']} to='/signup'>
            Sign Up
          </Link>
        </div><% if (!answers.includeRedux) { %>
        {
          snackCanOpen && typeof errorMessage !== null &&
            <Snackbar
              open={snackCanOpen && typeof errorMessage !== 'null'}
              message={errorMessage}
              action='close'
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
        }
<% } %><% if (answers.includeRedux) { %>
        {
          isLoaded(authError) && !isEmpty(authError) && snackCanOpen &&
            <Snackbar
              open={isLoaded(authError) && !isEmpty(authError) && snackCanOpen}
              message={authError ? authError.message : 'Signup error'}
              action='close'
              autoHideDuration={3000}
            />
        }<% } %>
      </div>
    )
  }
}
