import React from 'react';
import { BTable } from 'bcomponents';

const columns = [{
  title: 'Pool',
  dataIndex: 'Pool',
  key: 'Pool',
}, {
  title: 'Date',
  dataIndex: 'Date',
  key: 'Date',
}, {
  title: 'NetWorth',
  dataIndex: 'NetWorth',
  key: 'NetWorth',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listPoolNetWorth',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Options Pool Networth
      </div>
    );
  }
}

export default BasicTable;
