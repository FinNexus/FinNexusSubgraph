import React from 'react';
import { BTable } from 'bcomponents';

const columns = [{
  title: 'Underlying',
  dataIndex: 'Underlying',
  key: 'Underlying',
}, {
  title: 'Call Amount',
  dataIndex: 'CallAmount',
  key: 'CallAmount',
}, {
  title: 'Call Usd Value',
  dataIndex: 'CallUsdValue',
  key: 'CallUsdValue',
}, {
  title: 'Put Amount',
  dataIndex: 'PutAmount',
  key: 'PutAmount',
},{
  title: 'Put Usd Value',
  dataIndex: 'PutUsdValue',
  key: 'PutUsdValue',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listOptionActiveVol',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
         Active Options Volume
      </div>
    );
  }
}

export default BasicTable;
