import React, { Component } from 'react';
import Loading from '../../src/Loading.jsx';
import tools from '../../tools/public_tools';
import form_tools from '../../tools/form_tools';
class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            new: false,
            list: [],
            loading: true
        }
        this.objArr=[];
    }

    componentWillMount() {

    }

    getList() {
        fetch('/property/monitor.do?'+ tools.parseParam({ warehouse_id: this.props.params.id }), {
            method: "get",
            credentials:'same-origin'
          }).then(response => response.json())
          .then((result)=>{

            if (result.code == 'SUCCESS') {
                this.setState({
                    list: result.data,
                    loading: false
                }, () => {
                    let list = result.data;
                    for (let i = 0; i < list.length; i++) {
                        this.objArr.push(new videoConstructor('video' + list[i].id, list[i].play_url, 'videoPlay' + list[i].id));
                    }
                });
            } else {
                this.setState({
                    loading: false
                })
            }
          });
    }


    componentDidMount() {
        this.setState({ new: true });
        const {list, loading} = this.state;

        this.getList();

    }



    componentWillUnmount() {

       /* CKobject = null;*/
       this.objArr=[];
    }



    render() {
        const {list} = this.state;

        const html = list.map((obj, idx) => {
            return (
                <div id={'videoPlay' + obj.id} key={obj.id} className="videoBox box1 col-md-4 pb10" ></div>
            )

        })

        return (
            <div className="row">

                {html}
            </div>
        );
    }
}

export default Video;