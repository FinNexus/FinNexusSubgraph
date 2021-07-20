import React from 'react';
import { BTable } from 'bcomponents';

const columns = [{
  title: 'Token Name',
  dataIndex: 'TokenName',
  key: 'TokenName',
}, {
  title: 'Date',
  dataIndex: 'Date',
  key: 'Date',
}, {
  title: 'Call Amount',
  dataIndex: 'CallAmount',
  key: 'CallAmount',
}, {
  title: 'Call Usd Value',
  dataIndex: 'CallUsdValue',
  key: 'CallUsdValue',
},{
  title: 'Put Amount',
  dataIndex: 'PutAmount',
  key: 'PutAmount',
},{
  title: 'Put Usd Value',
  dataIndex: 'PutUsdValue',
  key: 'PutUsdValue',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listOptionPremium',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Options Premium
      </div>
    );
  }
}

export default BasicTable;
