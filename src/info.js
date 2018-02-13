import React, {PureComponent} from 'react';

export default class GatewayInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = info.name;

    return (
      <div>
        {displayName}
      </div>
    );
  }
}
