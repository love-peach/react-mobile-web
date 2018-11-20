import React from 'react';
import styles from './footer.module.scss';
export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBottom: true,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScrollHandle);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollHandle);
  }

  onScrollHandle = event => {
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = event.target.body.scrollHeight;
    const isBottom = clientHeight + scrollTop === scrollHeight;
    if (isBottom) {
      this.setState({
        isBottom: true,
      });
    } else {
      this.setState({
        isBottom: false,
      });
    }
  };

  render() {
    const { footerHide } = this.props.route;
    return !footerHide ?  (
      <div className={`app-footer ${styles.footer_wrap} ${this.state.isBottom ? '' :  styles.shadow}`}>
        客服电话：<a href="tel:4000887626">400—088—7626</a>
      </div>
    ) : null
  }
}
