import React from 'react';
import { BTable } from 'bcomponents';

const columns = [{
  title: 'Token Name',
  dataIndex: 'Token',
  key: 'Token',
}, {
  title: 'Date',
  dataIndex: 'Date',
  key: 'Date',
}, {
  title: 'Amount',
  dataIndex: 'Amount',
  key: 'Amount',
}, {
  title: 'Usd Value',
  dataIndex: 'UsdValue',
  key: 'UsdValue',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listOptionTVL',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Options TVL
      </div>
    );
  }
}

export default BasicTable;
