import React from 'react';
import style from './index.module.scss';

export default class RealNameLiving extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponentType: '',
    };
  }

  jumpTo = () => {
    this.props.history.push('/card');
  }

  render() {
    return (
      <div className={['grid-container', style.demo].join(' ')} onClick={this.jumpTo}>
        <div>living</div>
        <div className="grid-row">
          <div className="grid-col-3">1</div>
          <div className="grid-col-3">1</div>
          <div className="grid-col-3">1</div>
          <div className="grid-col-3">1</div>
        </div>
        <div style={{height: '1000px'}}>height</div>
      </div>
    )
  }
}
