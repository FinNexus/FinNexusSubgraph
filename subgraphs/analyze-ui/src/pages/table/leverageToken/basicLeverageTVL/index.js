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
  title: 'Amount',
  dataIndex: 'Amount',
  key: 'Amount',
}, {
  title: 'UsdValue',
  dataIndex: 'UsdValue',
  key: 'UsdValue',
}]


@BTable.tableEffectHoc({
  url: '/api/table/listLeverageTVL',
  columns: columns
})
class BasicTable extends React.Component {

  render() {
    return (
      <div style={{marginBottom: '20px'}}>
        Leverage Token TVL
      </div>
    );
  }
}

export default BasicTable;
