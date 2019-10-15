
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../src/Loading';
import Form from '../../src/Form';
import FormCtrl from '../../src/FormCtrl';
import Input from '../../src/Input';
import InputGroup from '../../src/InputGroup';
import Process from '../../src/Process';
import Toast from '../../src/Toast';

import tools from '../../tools/public_tools';
class Login extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'Form';
        this.state = {
          codeImgSrc:this.getCodeImgSrc()
        }
        this.pointer={}
    }

    componentWillMount() {

    }
    getCodeImgSrc=()=>{
      return "/system/verify.do?width=100&height=31&font_size=20&code_time="+(new Date()).valueOf();
    }
    resetCodeImgSrc=()=>{
      this.setState({codeImgSrc:this.getCodeImgSrc()})
    }
    getForm=(data)=>{
      Process.show();
      fetch('/auth.do', {
        method:"post",
        credentials:'same-origin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:tools.parseParam(data)
      }).then(response => response.json())
      .then((res)=>{
        Process.Close();
        Toast.show({msg:res.info})
        if(res.code=="SUCCESS"){
          location.href="/"  
        }else{
          this.resetCodeImgSrc();
        }
    });
     
    }
    render() {
      let {loading,codeImgSrc}=this.state;
        return (
  
          <div className="Card-box" >
            <Form  formStyle="ver" onSubForm={this.getForm} >
            	<FormCtrl name="username"     required={true} type="text"   placeholder="请在这里输入您的账号" />
      				<FormCtrl name="password"     required={true} type="password"   placeholder="请在这里输入您的密码" />
      				<FormCtrl name="verify_code"  required={true} type="input-group" placeholder="请在这里输入右边验证码"  barHtml={<img className="code-img vm" onClick={this.resetCodeImgSrc} src={codeImgSrc} />}  ></FormCtrl>
            </Form>
          </div>
        )
    }
}


ReactDOM.render(
  <Login />,
  document.getElementById('wrap')
);

