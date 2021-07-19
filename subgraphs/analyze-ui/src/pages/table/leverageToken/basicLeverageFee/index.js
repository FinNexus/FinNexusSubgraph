import React from 'react';
import { BTable } from 'bcomponents';

const columns = [{
  title: 'Token Name',
  dataIndex: 'TokenName',
  key: 'TokenName',
}, {
  title: 'Date',
  dataIndex: 'TimeStamp',
  key: 'TimeStamp',
}, {
  title: 'Amount',
  dataIndex: 'Amount',
  key: 'Amount',
}, {
  title: 'UsdValue',
  dataIndex: 'Value',
  key: 'Value',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listLeverageFee',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Leverage Token Fees
      </div>
    );
  }
}

export default BasicTable;
