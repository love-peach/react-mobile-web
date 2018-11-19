import React from 'react';

export default class RealNameLiving extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponentType: '', // 1: face,2：faild,3:hand
    };
  }

  render() {
    return (
      <div>card</div>
    )
  }
}
