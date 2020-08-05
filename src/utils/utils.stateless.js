import React, { Fragment } from 'react'
// import Ellipsis from '@components/Ellipsis';
import { globalColProps } from '@common/config'
import { Divider, Icon, Modal, Select, Tooltip, message, Menu, Col, Form } from 'antd'

const { Option } = Select
const FormItem = Form.Item
const { Item: MenuItem } = Menu

/**
 * @description 表单问号提示
 * @param {String} text
 */
export function questionTooltip(text) {
  return (
    <Fragment>
      &nbsp; &nbsp;
      <Tooltip placement='right' title={text}>
        <Icon type='question-circle-o' style={{ color: 'red' }} />
      </Tooltip>
    </Fragment>
  )
}

/**
 * @description 静态模态窗口
 * @param {String} title
 * @param {String} text
 */
export function staticModal(title, text) {
  Modal.info({
    title,
    content: text
  })
}

/**
 * @description 静态详情
 * @param {String} msg
 */
export function staticMessage(msg) {
  message.info(msg, 5000)
}

/**
 * @description 构造下拉列表值
 * @param {String} value
 * @param {String} name
 */
export function CreateOption(value, name) {
  return (
    <Option value={value} title={name} key={value}>
      {name}
    </Option>
  )
}

/**
 * @description 构造分割线
 * @param {String} text
 */
export function CreateDivider(text) {
  return (
    <Divider
      orientation='left'
      style={{
        fontSize: '16px',
        fontWeight: 700,
        marginBottom: '40px'
      }}>
      {text}
    </Divider>
  )
}

/**
 * @description 构造表单项目
 * @param {String} value
 * @param {String | ReactNode } element
 */
// export function CreateFormItem(value, element) {
//   return (
//     <Col {...globalColProps} key={value}>
//       <FormItem label={value} {...globalFormItemLayout}>
//         {element}
//       </FormItem>
//     </Col>
//   )
// }

/**
 * @description 构造动态表单项目
 * @param {String} value
 * @param {String} name
 */
// export function CreateDynamicFormItem(value, name) {
//   const style = {
//     height: '0px',
//     position: 'absolute',
//     right: '15px'
//   };

//   const item = () => (
//     <div style={style}>
//       <Ellipsis tooltip length={8}>
//         {name}
//       </Ellipsis>
//     </div>
//   );

//   return (
//     <Col {...globalColProps} key={value}>
//       <FormItem label={item} {...globalFormItemLayout}>
//         {name}
//       </FormItem>
//     </Col>
//   );
// }

/**
 * @description 构造菜单项目
 * @param {String} value
 * @param {String} id
 * @param {String} iconType
 */
export function CreateMenuItem(name, id, iconType) {
  return (
    <MenuItem key={id}>
      <Icon type={iconType} />
      {name}
    </MenuItem>
  )
}

/**
 * @description 构造FormItem
 * @param {Object} form
 * @param {String|ReactNode} label
 * @param {String} decoratorId
 * @param {Object} decoratorOptions
 * @param {ReactNode} components
 */
export function createFilterComponents(form, label, decoratorId, decoratorOptions, components) {
  const { getFieldDecorator } = form
  return (
    <Col {...globalColProps} key={decoratorId}>
      <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label={label}>
        {getFieldDecorator(decoratorId, decoratorOptions)(components)}
      </FormItem>
    </Col>
  )
}
