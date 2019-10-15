import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory, hashHistory } from 'react-router';
import Loading from '../../../src/Loading';
import Modal from '../../../src/Modal';
import Sider from '../../publicPages/Sider';
import AppBar from '../../publicPages/AppBar';
import DzzcdetailsInfo from '../../pages/dzzcDetails_info';
import Panel from '../../comp/Panel';
import tools from '../../../tools/public_tools';

const typeTree = function (result, re_id, clickFn = false) {

  let rtn = [];
  let i;
  for (i in result) {
    if (result[i].parent_id == re_id) {
      result[i].icon = "jiantou-copy"
      result[i].open = false;
      if (clickFn) result[i].click = () => { clickFn(result[i].id, result[i].agent_name); }
      result[i].children = typeTree(result, result[i].id, clickFn);
      rtn.push(result[i]);
    }
  }
  return rtn;
}
let topComp = "";
class Wrap extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'Form';
    this.state = {
      closeSider: document.documentElement.clientWidth > 750 ? false : true,
      loading: true,
      userInfo: {},
      otherInfoData: "",
      menuData: [],
      agentData: []
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
  filterMenuData = (data) => {
    for (let i in data) {
      data[i].agent_name = data[i].name;
    }
    return data;
  }
  turnAgent = (id, name) => {
    Modal.show({
      child: <div className="fs14 ">确认是否要切换到 <span className="base-color">{name}</span> 的页面？</div>,
      conf: {
        footer: (
          <div>
            <a href="javascript:;" onClick={() => {
              tools.setCookie("agent_id", id);
              location.reload();
            }} className="btn btn-info">确认切换</a>
            <a href="javascript:;" onClick={() => {
              Modal.close();
            }} className="btn btn-default">取消</a>
          </div>
        )
      }
    })
  }
  getMenu = () => {
    fetch('/system/my-menu.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((res) => {
        let { menuData } = this.state;
        res.data.data = this.filterMenuData(res.data);
        let newArr = menuData.concat(typeTree(res.data, 0));
        this.setState({ menuData: newArr })
      });

    fetch('/agent.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((data) => {
        if (data.code == "SUCCESS") {
          let { menuData, agentData } = this.state;
          let arr1 = [
            { agent_name: "首页", icon: "home", url: "#", children: [] },
          ]
         // let newArr = arr1.concat(typeTree(data.data, 0, this.turnAgent)).concat(menuData);
          let newArr=arr1.concat(menuData);
          this.setState({ menuData: newArr, agentData: data.data })
        }

      });


  }
  getUserInfo = () => {
    fetch('/auth.do', {
      method: "get",
      credentials: 'same-origin'
    }).then(response => response.json())
      .then((result) => {
        if (result.code == "SUCCESS") {
          try {
            result.data.avatar = JSON.parse(result.data.avatar)[0].image;
          } catch (e) { }
          this.setState({ userInfo: result.data, loading: false })
        } else {
          Toast.show({ msg: data.info });
        }
      });
  }
  toggleSider = () => {
    let { closeSider } = this.state;
    this.setState({ closeSider: !closeSider })
  }
  hookInfoData = (data) => {
    this.setState({ otherInfoData: data })
  }
  render() {
    let { closeSider, loading, menuData, agentData,otherInfoData, userInfo } = this.state;
    if (loading) {
      return (<Loading></Loading>)
    }

    let pathname = this.props.location.pathname;
    let pageProps = { key: pathname, userInfo }
    if (pathname.indexOf('zc.html') >= 0 || pathname.indexOf('zcafter.html') >= 0) {
      pageProps.type = this.props.params.type ? this.props.params.type : 'index';
      pageProps.id = this.props.params.id ? this.props.params.id : false;
    }
    if (pathname.indexOf("dzzc") >= 0) {
      pageProps.infoData = tools.deepCopy(otherInfoData);

    }
    return (
      <div className={"content-all-wrap " + (closeSider ? "close-sider" : "")}>

        <Sider menuData={menuData}></Sider>
        <AppBar agentData={agentData} onClickToggle={this.toggleSider}></AppBar>
        <div className="main-wrap " >
          {(() => {
            if (pathname.indexOf("dzzc") >= 0) {
              return (
                <div>
                  <div className="clearfix">

                  </div>
                  <div className="">
                    <Panel title={<span>资产信息<a href="javascript:history.go(-1);" className="assist-color ml5">返回</a></span>} type="default" noWrap={true}>
                      <DzzcdetailsInfo id={this.props.params.id} hookInfoData={this.hookInfoData}></DzzcdetailsInfo>
                    </Panel>
                  </div>

                </div>
              );
            } else {
              return (<div></div>);
            }

          })()}

          {React.cloneElement(this.props.children || <div />, pageProps)}

        </div>
      </div>
    )
  }
}

var routes = {
  component: Wrap,
  childRoutes: [
     {
      path: '/test',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/Test').default)
        }, 'Test')
      }
    },
    {
      path: '/zc.html(/:id)(/:type)(/:upData)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/zcDetails').default)
        }, 'zcDetails')
      }
    },
    {
      path: '/dzzc.html(/:id)(/:type)(/:upData)(/:add_id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/dzzcDetails').default)
        }, 'dzzcDetails')
      }
    },
    {
      path: '/zcafter.html(/:id)(/:type)(/:upData)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/zcDetailsAfter').default)
        }, 'zcDetailsAfter')
      }
    },
    {
      path: '/cp.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/cpDetails').default)
        }, 'cpDetails')
      }
    },
    {
      path: '/zclist.html(/:listType)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/zcList').default)
        }, 'zcList')
      }
    },
    {
      path: '/cplist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/cpList').default)
        }, 'cpList')
      }
    },
    {
      path: '/cp/add(/:level)(/:brand_id)(/:series_id)(/:model_id)(/:city_id)(/:reg_time)(/:mileage)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/cpAdd').default)
        }, 'cpAdd')
      }
    },
    {
      path: '/dd/detail(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ddEdit').default)
        }, 'ddEdit')
      }
    },
    {
      path: '/ddlist.html(/:listType)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ddList').default)
        }, 'ddList')
      }
    },
    {
      path: '/dd.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ddDetails').default)
        }, 'ddDetails')
      }
    },
    {
      path: '/cdlist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/cdList').default)
        }, 'cdList')
      }
    },
    {
      path: '/yclist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ycList').default)
        }, 'ycList')
      }
    },
    {
      path: '/zslist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/zsList').default)
        }, 'zsList')
      }
    },
    {
      path: '/hylist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/hylist').default)
        }, 'hylist')
      }
    },
    {
      path: '/fklist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/fklist').default)
        }, 'fklist')
      }
    },
    {
      path: '/cklist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/cklist').default)
        }, 'cklist')
      }
    },
    /* {
       path: '/yklist.html',
       getComponent: function (nextState, cb) {
         require.ensure([], function (require) {
           cb(null, require('../../pages/yklist').default)
         },'yklist')
       }
     },*/
    {
      path: '/zqlist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/zqlist').default)
        }, 'zqlist')
      }
    },
    {
      path: '/shlist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/shlist').default)
        }, 'shlist')
      }
    },
    {
      path: '/czlist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/czlist').default)
        }, 'czlist')
      }
    },
    {
      path: '/jklist.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/jklist').default)
        }, 'jklist')
      }
    },
    {
      path: '/cdApplication.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/cdApplication').default)
        }, 'cdApplication')
      }
    },
    {
      path: '/warehouse/warehouse-list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/warehouseList').default)
        }, 'warehouselist')
      }
    },
    {
      path: '/warehouse(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/warehouseEdit').default)
        }, 'warehouseEdit')
      }
    },
    {
      path: '/spacelist(/:name)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/spaceList').default)
        }, 'spaceList')
      }
    },
    {
      path: '/space(/:type)(/:warehouse_id)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/spaceEdit').default)
        }, 'spaceEdit')
      }
    },
    {
      path: '/videolist(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/videoList').default)
        }, 'videoList')
      }
    },
    {
      path: '/videocont(/:type)(/:warehouse_id)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/videoContEdit').default)
        }, 'videoContEdit')
      }
    },
    {
      path: '/video(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/video').default)
        }, 'video')
      }
    },
    {
      path: '/first',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/PreLoanManagement/first').default)
        }, 'first')
      }
    },
    {
      path: '/khList',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/khList').default)
        }, 'khList')
      }
    },
    {
      path: '/kh/:id(/:listType)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/khItem').default)
        }, 'khItem')
      }
    },

    // ================用户模块================
    {
      path: '/user/list.html(/:agent_id)(/:name)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserList'))
        }, 'pages/UserList')
      }
    },
    {
      path: '/user/details(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserEdit'))
        }, 'pages/UserEdit')
      }
    },
    {
      path: '/user/editme',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserEditMe'))
        }, 'pages/UserEditMe')
      }
    },
    {
      path: '/user/role.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserRole'))
        }, '/pages/UserRole')
      }
    },
    {
      path: '/user/cat(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserCatEdit'))
        }, '/pages/UserCatEdit')
      }
    },
    {
      path: '/user/role(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/UserRoleEdit'))
        }, '/pages/UserRoleEdit')
      }
    },

    //================系统模块================
    {
      path: '/order/inspection.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/InspectionCatList'))
        }, 'pages/InspectionCatList')
      }
    },
    {
      path: '/property/monitor_edit(/:type)(/:id)(/:name)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/InspectionCatEdit'))
        }, 'pages/InspectionCatEdit')
      }
    },
    // 验车项目列表
    {
      path: '/property/monitor_item_list/:cat_id/:cat_name',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MonitorItemList'))
        }, 'pages/MonitorItemList')
      }
    },
    {
      path: '/property/monitor_edit_item(/:type)/:cat_id(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MonitorItemEdit'))
        }, 'pages/MonitorItemEdit')
      }
    },
    {
      path: '/system/resource-list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/ResourceList'))
        }, 'pages/ResourceList')
      }
    },

    {
      path: '/system/menu-list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/MenuList'))
        }, 'pages/MenuList')
      }
    },
    //代理商模块
    {
      path: '/agent/list.html',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/AgentList'))
        }, 'pages/AgentList')
      }
    },

    {
      path: '/agent/info(/:type)(/:id)',
      getComponent: function (nextState, cb) {
        require.ensure([], function (require) {
          cb(null, require('../../pages/AgentInfo'))
        }, '/pages/AgentInfo')
      }
    },
    {
      path: '/',
      getComponent: function (nextState, cb) {
        return require.ensure([], function (require) {

          cb(null, require('../../publicPages/Index').default)
        }, 'index')
      },

      indexRoute: {
        getComponent: function (nextState, cb) {
          return require.ensure([], function (require) {
            cb(null, require('../../publicPages/Index').default)
          }, 'index')

        }
      }
    }

  ]
}


ReactDOM.render((
  <Router history={hashHistory} routes={routes}>
  </Router>
), document.getElementById('wrap'))