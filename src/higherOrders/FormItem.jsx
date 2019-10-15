import React, {
  Component,
  createElement,
  PropTypes
} from 'react';
import tools from '../../tools/public_tools';
import lang from '../../lang/form';
import validate from '../validate/validate';
export const COMPONENTS={}
export const enhance = (ComponsedComponent) =>{
  class FormItem extends Component {

    constructor(props) {
      super(props);
     
    }
    /*shouldComponentUpdate(nextProps, nextState) {
      //return nextProps.value!=this.props.value;
      // 根据实际情况判断当前帖子的状态是否和之前不同
    }*/
    render() {
      let props=tools.deepCopy(this.props);

      delete props.transmitForm;
      return <ComponsedComponent {...props}  />;
    }
  };
  return FormItem;
}

export const regComp=(ComposedComponent, types = [], options = {})=>{
  let newComponent = enhance(ComposedComponent);
  if (!Array.isArray(types)) {
    types = [types];
  }

  types.forEach((type) => {

    if (COMPONENTS.hasOwnProperty(type)) {
      console.warn(lang.formItemReged(type));
      return;
    }

    let {
      valueType,
      render
    } = options;
    if (!valueType) {
      valueType = ['integer', 'number'].indexOf(type) > -1 ? 'number' : 'string';
    }

    if (!render) {
      render = (props) => createElement(newComponent, props);
    }

    COMPONENTS[type] = {
      render,
      valueType,
      component: ComposedComponent
    }
  });

  return newComponent;
}

