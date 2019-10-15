import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory, hashHistory } from 'react-router';
import Loading from '../../src/Loading';
import Sider from '../../public_page/Sider';
import AppBar from '../../public_page/AppBar';

const typeTree = function (result, re_id) {

  let rtn = [];
  let i;
  for (i in result) {
    if (result[i].parent_id == re_id) {
      result[i].icon = "xia"
      result[i].children = typeTree(result, result[i].id);
      rtn.push(result[i]);
    }
  }
  return rtn;
}
class Wrap extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'Form';
    this.state = {
      closeSider: document.documentElement.clientWidth > 750 ? false : true,
      loading: true,
      userInfo: {},
      menuData: [],
      menuName: ''
    }
  }

  componentWillMount() {
    this.getUserInfo();
    this.getMenu();
  }
  static childContextTypes = {
    userInfo: React.PropTypes.object,
    getUserInfo: React.PropTypes.func
  }
  getChildContext() {
    return {
      userInfo: this.state.userInfo,
      getUserInfo: this.getUserInfo
    };
  }
  getMenu = () => {
    fetch('/system/my-menu.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        let arr1 = [
          { name: "首页", icon: "home", url: "#", children: [] },
        ]
        let newArr = arr1.concat(typeTree(data.data.data, 0));
        this.setState({ menuData: newArr })
      });
  }
  getUserInfo = () => {
    fetch('/auth.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((result) => {
        if (result.code == "SUCCESS") {
          this.setState({ userInfo: result.data, loading: false })
        } else {
          Toast.show({ msg: data.info });
        }
      });
  }
  toggleSider = () => {
    let {closeSider} = this.state;
    this.setState({ closeSider: !closeSider })
  }

  handleMenu = (name) => {
    this.setState({
      menuName: name
    });
  }

  render() {
    let {closeSider, loading, menuData, menuName} = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }

    let pathname = this.props.location.pathname;
    return (
      <div className={"content-all-wrap " + (closeSider ? "close-sider" : "")}>

        <Sider menuData={menuData} handlePost={this.handleMenu}></Sider>
        <AppBar onClickToggle={this.toggleSider}></AppBar>
        <div className="main-wrap " >
          <h1 className="fs18 pb15 pl5">{menuName}</h1>
          <div className="main " >
            {React.cloneElement(this.props.children || <div />, { key: pathname })}
          </div>
        </div>
      </div>
    )
  }
}

var routes = {
  component: Wrap,
  childRoutes: [

    /*{ path: '/content/article_list.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/ArticleList'))
        })
      }
    },
    { path: '/content/article(/:type)(/:catid)(/:id)',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/ArticleEdit'))
        })
      }
    },*/
    // 2.栏目列表
    // {
    //   path: '/content/category.html',
    //   getComponent: function (nextState, cb) {
    //     require.ensure([], function (require) {
    //       cb(null, require('../../pages/CategoryList'))
    //     })
    //   }
    // },
    /*
     // 3.借款模块
    { path: '/borrow/list.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/BorrowModel'))
        })
      }
    },
    { path: '/borrow/details(/:type)(/:product_nid)(/:borrow_id)',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/BorrowEdit'))
        })
      }
    },
    { path: '/borrow/product_list.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/BorrowProduct'))
        })
      }
    },
    { path: '/borrow/repayment_list.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/RepaymentList'))
        })
      }
    },
    */
    // 资金模块
    {
      path: '/asset/withdrawa.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/WithdrawaList'))
        })
      }
    },
    {
      path: '/asset/recharge.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/RechargeList'))
        })
      }
    },

    {
      path:  '/asset.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/AssetList'))
        })
      }
    },
    // 3.用户模块
    {
      path: '/user/list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserList'))
        })
      }
    },
    {
      path: '/user/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserEdit'))
        })
      }
    },

    {
      path: '/user/role.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserRole'))
        })
      }
    },

    {
      path: '/system/resource-list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ResourceList'))
        })
      }
    },

    {
      path: '/system/menu-list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MenuList'))
        })
      }
    },
    {
      path: '/system/dictionary-list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/DictionaryList'))
        })
      }
    },
    /*

    { path: '/system/menu-list.html',
  getComponent: function(nextState, cb) {
    require.ensure([], function(require) {
      cb(null, require('../../pages/MenuList'))
    })
  }
},
/*
// { path: '/system/property-list.html',
{ path: '/depot/assets_list.html',
  getComponent: function(nextState, cb) {
    require.ensure([], function(require) {
      cb(null, require('../../pages/PropertyModel'))
    })
  }
}, */

    //***** 资金账户模块*****

    // 充值列表
    /*
    { path: '/account/recharge_list.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/RechargeList'))
        })
      }
    },
    // 现金列表
    { path: '/account/withdrawal_list.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/WithdrawalList'))
        })
      }
    },
    // 资金流水
    { path: '/account/account_log.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/AccountlogList'))
        })
      }
    },
    // ***** 投资管理模块 *****
    // 投资列表
    { path: '/invest/invest_list.html',
      getComponent: function(nextState, cb) {
        require.ensure([], function(require) {
          cb(null, require('../../pages/InvestList'))
        })
      }
    },
    */
    // ***** 会员管理模块 *****
    // 会员列表
    {
      path: '/member/list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MemberList'))
        })
      }
    },

    {
      path: '/mishuo.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MishuoList'))
        })
      }
    },
    {
      path: '/mishuo/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MishuoEdit'));
        })
      }
    },
    /* 探客内容 start */

    {
      path: '/explorer/verify.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/TankeList'))
        })
      }
    },
    {
      path: '/explorer.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/TankeManager'))
        })
      }
    },
    {
      path: '/tanke/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/TankeEdit'));
        })
      }
    },
    /* 探客内容 end */
    // 会员组列表
    {
      path: '/member/grouplist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/GroupList'))
        })
      }
    },
    {
      path: '/member/realname_list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Realnamelist'))
        })
      }
    },
    {
      path: '/member/detail(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Realnamedetail'))
        })
      }
    },
    // 商家管理
    {
      path: '/merchant/verify.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MerchantVerifyList'))
        })
      }
    },

    {
      path: '/merchant.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MerchantList'))
        })
      }
    },
    {
      path: '/merchant/detailsVerify(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MerchantVerifyEdit'))
        })
      }
    },
    {
      path: '/merchant/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MerchantEdit'))
        })
      }
    },
    //广告
    {
      path: '/ads/ads_manage_list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Adsmanage'))
        })
      }
    },
    {
      path: '/ads/ads_first.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Adsfirstlist'))
        })
      }
    },
    {
      path: '/ads/adsfirstEdit/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/adsfirstEdit'))
        })
      }
    },
    {
      path: '/ads/ads_audit_list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Adsauditlist'))
        })
      }
    },
    {
      path: '/ads/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/AdsEdit'));
        })
      }
    },
    //夺宝

    {
      path: '/oneyuan/goods.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/OneyuangoodManager'));
        })
      }
    },
    {
      path: '/oneyuan/dbgoods.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/DbgoodManager'));
        })
      }
    },
    {
      path: '/oneyuan/dbgoods/details(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/DbgoodDetail'));
        })
      }
    },
    {
      path: '/oneyuan/dbgoods/periods(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/DbgoodPeriods'));
        })
      }
    },
    {
      path: '/oneyuan/dbgoods/record(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/DbgoodRecord'));
        })
      }
    },
    //夺宝订单管理
    {
      path: '/oneyuan/order.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Dborder'));
        })
      }
    },
    {
      path: '/oneyuan/order/details(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/DborderDetails'));
        })
      }
    },
    //分类管理
    {
      path: '/oneyuan/category.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/OneyuancategoryManager'));
        })
      }
    },
    {
      path: '/oneyuan/category(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/OneyuancategoryDetail'));
        })
      }
    },
    {
      path: '/oneyuan/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/OneyuangoodDetail'));
        })
      }
    },
    //内容管理
    {
      path: '/content/tags.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/TagManger'));
        })
      }
    },
    {
      path: '/content/category.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Category'));
        })
      }
    },
    {
      path: '/content/category/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/CategoryEdit'));
        })
      }
    },
    {
      path: '/content/article_list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ArticleList'));
        })
      }
    },
    {
      path: '/content/article_list/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ArticleEdit'));
        })
      }
    },
    //进店有米管理
    {
      path: '/content/jindian.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Jindianlist'));
        })
      }
    },
    //进店有米审核
    {
      path: '/jindian/jindian_auditelist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Jindianauditelist'));
        })
      }
    },
    {
      path: '/jindian/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/JindianEdit'));
        })
      }
    },
    // 版本信息管理
    {
      path: '/system/versionlist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Versionlist'));
        })
      }
    },
    {
      path: '/system/version/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/VersionEdit'));
        })
      }
    },
    //夺宝晒单
    {
      path: 'oneyuan/order/saidan(/:type)(/:id)(/:vip_id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Saidan'));
        })
      }
    },
    {
      path: 'oneyuan/order/saidanlist(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/SaidanList'));
        })
      }
    },
    {
      path: '/oneyuan/ads.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/OneyuanAds'));
        })
      }
    },
    {
      path: '/oneyuan/ads/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/OneyuanAdsEidt'));
        })
      }
    },

    {
      path: '/',
      getComponent: function (nextState, cb) {
        return require.ensure([], function (require) {

          cb(null, require('../../public_page/Index'))
        })
      },
      indexRoute: {
        getComponent: function (nextState, cb) {

          return require.ensure([], function (require) {
            cb(null, require('../../public_page/Index'))
          })
          return cb()
        }
      }
    }

  ]
}


ReactDOM.render((
  <Router history={hashHistory} routes={routes}>

  </Router>
), document.getElementById('wrap'))