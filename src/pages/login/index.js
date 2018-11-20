import React from 'react';
import store from 'utils/store';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponentType: '', // 1: face,2：faild,3:hand
    };
  }

  login = () => {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    store.setAuthed(true);
    console.log(from, 'from');
    this.props.history.push(from.pathname)
  }

  render() {
    return (
      <div onClick={this.login}>login</div>
    )
  }
}
