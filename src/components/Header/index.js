import React from 'react';
import styles from './header.module.scss';
export default class Header extends React.Component {

  componentWillMount() {}

  goBack = () => {
    const href = window.location.href;
    if(href.indexOf('auth/selectproduct') !== -1){
      window.history.back();
      return;
    }
    if(href.indexOf('/auth/protocolauth')!== -1){
      window.history.back();
      return;
    }else if (href.indexOf('/auth/') !== -1 || href.indexOf('/smallloan/') !== -1) {
      window.location.href = window.location.origin + '/auth/home';
      return;
    }else if(href.indexOf('/loan/success') !== -1){
      window.location.href = window.location.origin + '/repayment/home';
    }
    else{
      window.history.back();
      return;
    }

  }

  render() {
    const { title, headerHide, arrowHide } = this.props.route;
    const ua = window.navigator.userAgent;
    const isShowHeader = !/MicroMessenger/i.test(ua) && !/SuiXingPay-Mpos/i.test(ua) && !/SuiXingPay-Cashier/i.test(ua) && !headerHide;
    const isShowHeaderArrow = !arrowHide;
    return isShowHeader ?  (
      <div className={['app-header', styles.header_wrap].join(' ')}>
        {isShowHeaderArrow ? (
          <div className={styles.arrows}>
            <div className={styles.left} onClick={() => this.goBack()} />
          </div>
        ) : null}
        <div className={styles.center} id='headerTitle'>{title}</div>
      </div>
    ) : null
  }
}
