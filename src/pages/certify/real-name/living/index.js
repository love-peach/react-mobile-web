import React from 'react';
import style from './index.module.scss';

export default class RealNameLiving extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponentType: '',
    };
  }

  render() {
    return (
      <div className={style.demo}>living</div>
    )
  }
}
