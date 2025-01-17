import React from 'react';
import { useTable } from '@refinedev/core';
import { Table, Space, Button, Spin, Alert } from 'antd';
import { BaseRecord, HttpError } from '@refinedev/core';
import './ResourceList.css';

interface IResource extends BaseRecord {
  id: string;
  name: string;
}

const ResourceList: React.FC = () => {
  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    pageSize,
    pageCount,
    sorters,
    filters,
    setCurrent,
    setPageSize,
    setSorters,
    setFilters,
  } = useTable<IResource, HttpError>({
    resource: 'resources',
    pagination: {
      current: 1,
      pageSize: 10,
    },
    syncWithLocation: true,
  });

  const tableData = data?.data || [];
  const total = data?.total || 0;

  if (isError) {
    return (
      <Alert
        message="Error"
        description="Failed to load resources"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="resource-list">
      <Spin spinning={isLoading}>
        <Table
          dataSource={tableData}
          rowKey="id"
          className="resource-table"
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size);
            },
          }}
        >
          <Table.Column 
            dataIndex="name" 
            title="Name" 
            sorter
          />
          <Table.Column
            title="Actions"
            className="actions-cell"
            render={(text, record) => (
              <Space>
                <Button className="action-button edit">Edit</Button>
                <Button className="action-button delete">Delete</Button>
              </Space>
            )}
          />
        </Table>
      </Spin>
    </div>
  );
};

export default ResourceList;
