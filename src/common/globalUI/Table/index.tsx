import * as React from 'react'
import { Table } from 'antd'
import * as GlobalConfig from '@common/config'

const { globalPaginationProps, globalTableProps } = GlobalConfig

interface Props {
  columns: Array<object>;
  loading: boolean;
  resList: Array<object>;
  resTotal: number;
  rowKey: string;
  scrollX?: number;
  filterObj?: object;
  basePageRequest?: Function;
}

interface State {
  pageNum: number,
  pageSize: number
}

export default class GlobalTable extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      pageSize: 10
    }
  }

  changePage = (pageNum, pageSize) => {
    const { filterObj, basePageRequest } = this.props
    this.setState({
      pageNum,
      pageSize
    })
    const tempPayloadMain = {
      ...filterObj,
      pageNum,
      pageSize
    }
    if (basePageRequest) {
      basePageRequest(tempPayloadMain)
    }
  }

  render() {
    const { columns, loading, resList, resTotal, rowKey, scrollX } = this.props
    const { pageNum, pageSize } = this.state
    const { bordered, showHeader } = globalTableProps;
    return (
      <Table
        bordered={bordered}
        size={'small'}
        showHeader={showHeader}
        columns={columns}
        dataSource={resList}
        loading={loading}
        rowKey={rowKey}
        scroll={{ x: scrollX || '100%' }}
        pagination={{
          ...globalPaginationProps,
          current: pageNum,
          total: resTotal,
          pageSize,
          showTotal: total => `总 ${total} 项`,
          onChange: () => this.changePage(pageNum, pageSize),
          onShowSizeChange: () => this.changePage(pageNum, pageSize)
        }}
        {...this.props}
      />
    )
  }
}
