import React, { Component, Fragment } from 'react';
import { Timeline, Card } from 'antd';
import { globalCardProps } from '@common/config';

const TimelineItem = Timeline.Item;
const codeStyle = {
  margin: '0 1px',
  background: '#f2f4f5',
  padding: '.2em .4em',
  fontSize: '.9em',
  border: '1px solid #eee',
  borderRadius: '3px',
};
const codeCNStyle = {
  ...codeStyle,
  fontFamily: 'sens-serif',
};
const h2Style = {
  fontWeight: '500',
  clear: 'both',
};

const data = [
  {
    version: '2.0.0',
    time: '2019-06-22',
    finishList: [
      {
        option: 'update',
        desc: '修改',
      },
    ],
  },
];
const iconType = {
  insert: {
    icon: '❤️',
    text: '新增',
  },
  update: {
    icon: '🖌️',
    text: '修改',
  },
  fixed: {
    icon: '🐛',
    text: '修复',
  },
  delete: {
    icon: '🚮',
    text: '移除',
  },
};

export default class ChangeLog extends Component {
  CreateVersion = (version, time, list = []) => {
    const createList = item => {
      item.map(({ option, desc, childrenList = [] }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={index}>
          <p>
            {iconType[option].icon}
            <code style={codeCNStyle}>{iconType[option].text}</code>
            {desc}
          </p>
          <ul>{childrenList.length > 0 ? createList(childrenList) : null}</ul>
        </li>
      ));
    };
    return (
      <TimelineItem>
        <h2 style={h2Style}>
          <span>{version}</span>
        </h2>
        <p>
          <code style={codeStyle}>{time}</code>
        </p>
        <ul>{list.length > 0 ? createList(list) : null}</ul>
      </TimelineItem>
    );
  };

  render() {
    return (
      <Fragment>
        <Card {...globalCardProps} style={{ marginTop: 20 }}>
          <Timeline>
            {data.map(({ version, time, finishList }, index) => (
              <Fragment>{this.CreateVersion(version, time, finishList, index)}</Fragment>
            ))}
          </Timeline>
        </Card>
      </Fragment>
    );
  }
}
