import React from 'react';
import { Header, Footer } from 'components'

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponentType: '', // 1: face,2：faild,3:hand
    };
  }

  componentWillMount() {
    console.log('layout pageView');
    if(this.props.route.title) {
      document.title = this.props.route.title;
    }
  }

  render() {
    return (
      <div className="app-layout">
        <Header {...this.props} />
        <Footer {...this.props} />
        <div className="app-layout-inside">{this.props.children}</div>
      </div>
    )
  }
}
