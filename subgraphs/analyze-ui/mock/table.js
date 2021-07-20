let leverquery = require('./leverageTokenQuery.js');
let optionQuery = require('./optionQuery.js');

const responseJson = (data, code = 0) => {
  return {
    code,
    data
  }
}

const time = (fun) => {
  setTimeout(() => {
    fun && fun();
  }, 300);
};

export default {
  'GET /api/table/list': (req, res) => {
    const { pageNum, pageIndex, search } = req.query;
    const result = [];
    for (let i = 0; i < pageNum; i++) {
      const idx = (pageIndex - 1) * pageNum + i + 1;
      const name = `${search !== '' ? 'lisi' : 'zhangsan'}${idx}`;
      result.push({
        id: idx,
        name,
        email: `${name}@163.com`,
        createTime: new Date(),
      });
    }
    time(() => {
      res.send(responseJson({
        rows: result,
        count: 25,
      }));
    })
  },

  'GET /api/table/listLeverageTVL': (req, res) => {
    //const { pageNum, pageIndex, search } = req.query;
    leverquery.getTvls().then(
      (ret) => {
        let retArray = [];
        let len = 0;
        for (const key in ret) {
          //console.log('key', key, 'ret', ret);
          for(var i=0;i<ret[key].length;i++) {
            retArray.push({
              TokenName: ret[key][i].TokenName,
              Date: ret[key][i].Date,
              Amount: ret[key][i].Amount,
              UsdValue: ret[key][i].UsdValue
            });
          }
        }
       // console.log(retArray);
        time(() => {
          res.send(responseJson({
            rows: retArray,
            count: retArray.length,
          }));
        })
      })
  },

  'GET /api/table/listLeverageApy': (req, res) => {
    //const { pageNum, pageIndex, search } = req.query;
    leverquery.getApys().then(
      (ret) => {
        let retArray = [];
        let len = 0;
        for (const key in ret) {
          //console.log('key', key, 'ret', ret);
          for(var i=0;i<ret[key].length;i++) {
            retArray.push({
              TokenName: ret[key][i].Token,
              Date: ret[key][i].Date,
              Apy: ret[key][i].Apy,
            });
          }
        }
        //console.log(retArray);
        time(() => {
          res.send(responseJson({
            rows: retArray,
            count: retArray.length,
          }));
        })
      })
  },

  'GET /api/table/listLeverageTradeVol': (req, res) => {
    //const { pageNum, pageIndex, search } = req.query;
    leverquery.getTradeVol().then(
      (ret) => {
        let retArray = [];
        for (const key in ret) {
          //console.log('key', key, 'ret', ret);
          for(var i=0;i<ret[key].length;i++) {
            let item = ret[key][i];
            retArray.push({
              TokenName: item.TokenName,
              Date: item.TimeStamp,
              BuyLeverAmount: item.BuyLeverValue,
              BuyLeverValue: item.BuyLeverValue,
              SellLeverAmount: item.SellLeverAmount,
              SellLeverValue: item.SellLeverValue,
              BuyHedgeAmount: item.BuyHedgeAmount,
              BuyHedgeValue: item.BuyHedgeValue,
              SellHedgeAmount: item.SellHedgeAmount,
              SellHedgeValue: item.SellHedgeValue
            });
          }
        }
        //console.log(retArray);
        time(() => {
          res.send(responseJson({
            rows: retArray,
            count: retArray.length,
          }));
        })
      })
  },

  'GET /api/table/listLeverageFee': (req, res) => {
    //const { pageNum, pageIndex, search } = req.query;
    leverquery.getTradeFee().then(
      (ret) => {
        let retArray = [];
        for (const key in ret) {
         // console.log('key', key, 'ret', ret);
          for(var i=0;i<ret[key].length;i++) {
            retArray.push({
              TokenName: ret[key][i].Token,
              Date: ret[key][i].TimeStamp,
              Amount: ret[key][i].Amount,
              Value: ret[key][i].Value
            });
          }
        }
        //console.log(retArray);
        time(() => {
          res.send(responseJson({
            rows: retArray,
            count: retArray.length,
          }));
        })
      })
  },

  'GET /api/table/listTradeItems': (req, res) => {
    //const { pageNum, pageIndex, search } = req.query;
    leverquery.getEntityTradeItems().then(
      (ret) => {
        let retArray = [];
        for (const key in ret) {
          // console.log('key', key, 'ret', ret);
          for(var i=0;i<ret[key].length;i++) {
            let item = ret[key][i];
            retArray.push({
              Pool: item.Pool,
              Date: item.Date,
              Owner: item.Owner,
              Status: item.Status,
              Settlement: item.Settlement,
              Underlying: item.Underlying,
              Leveragetype: item.Leveragetype,
              Amount: item.Amount,
              Value: item.Value,
              Price: item.Price
            });
          }
        }
        //console.log(retArray);
        time(() => {
          res.send(responseJson({
            rows: retArray,
            count: retArray.length,
          }));
        })
      })
  },

  'POST /api/table': (req, res) => {
    res.send(responseJson('添加成功!'));
  },
  'PUT /api/table/:id': (req, res) => {
    res.send(responseJson('编辑成功!'));
  },
  'DELETE /api/table/:id': (req, res) => {
    res.send(responseJson('删除成功!'));
  }
};
