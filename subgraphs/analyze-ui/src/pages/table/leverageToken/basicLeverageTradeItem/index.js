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
},{
  title: 'Owner',
  dataIndex: 'Owner',
  key: 'Owner',
}, {
  title: 'Status',
  dataIndex: 'Status',
  key: 'Status',
}, {
  title: 'Settlement',
  dataIndex: 'Settlement',
  key: 'Settlement',
},{
  title: 'Underlying',
  dataIndex: 'Underlying',
  key: 'Underlying',
},{
  title: 'Leveragetype',
  dataIndex: 'Leveragetype',
  key: 'Leveragetype',
},{
  title: 'Amount',
  dataIndex: 'Amount',
  key: 'Amount',
},{
  title: 'Value',
  dataIndex: 'Value',
  key: 'Value',
},{
  title: 'Price',
  dataIndex: 'Price',
  key: 'Price',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listTradeItems',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Leverage Token Trades
      </div>
    );
  }
}

export default BasicTable;
