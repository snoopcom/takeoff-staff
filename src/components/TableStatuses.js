import React from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import 'antd/dist/antd.css';
import getStatuses from '../api/index';
import {Input, Container, Info} from './Style';

const initState = {
  arrStatuses: [],
  allStatusesCache: [],
  arrNameStatuses: [],
  filteredInfo: null,
  sortedInfo: null,
  value: '',
  valueInfo: '',
}

export default class TableStatuses extends React.Component {
    state = initState;

    componentDidMount() {
      this.loadStatuses();
    }
    
    loadStatuses = async () => {
      const { arrStatuses } = this.state;
      try {
        const response = await getStatuses();

        const allStatuses = response.data.map((item) => {
          return {...item, id: _.uniqueId()} 
        });

        const nameStatuses = response.data.map((item) => {
          return item.name;
        })

        this.setState({
          arrStatuses: [...arrStatuses, ...allStatuses],
          allStatusesCache: [...allStatuses],
          arrNameStatuses: [...nameStatuses]
        });
        
      } catch (event) {
        console.log(event)
      }
    }

    dataRequest = () => {
      const { arrStatuses } = this.state; 
      const res = arrStatuses.map((item) => {
        return {
          key: _.uniqueId(),
          name: item.name,
          used: item.sites,
          type: item.type,
          status: item.status,
        }
      });
      return res;
    }

    inputChange = (e) => {
      e.preventDefault();
      const { arrStatuses, allStatusesCache } = this.state;
      const { value } = e.target;
      this.setState({ value });
      const res = arrStatuses.filter((item) => {
        return item.name.toLowerCase().search(value.toLowerCase())!== -1;
      })

      if (!res.length) {
        this.setState({
          valueInfo: 'Ничего не найдено :(',
        })
      } else {
        this.setState({
          valueInfo: '',
        })
      }

      this.setState({
        arrStatuses: [...res],
      })

      if (!value) {
        this.setState({
          arrStatuses: [...allStatusesCache],
          valueInfo: '',
        })
      }
    }    

    //------------
    handleChange = (pagination, filters, sorter) => {
      this.setState({
        filteredInfo: filters,
        sortedInfo: sorter,
      });
    };
  
    render() {
        let { sortedInfo, filteredInfo, value, valueInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        const columns = [
          {
            title: 'Tool name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name.includes(value),
            sorter: (a, b) => {
              return a.name.length - b.name.length
            },
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            ellipsis: true,
          },
          {
            title: 'Used on',
            dataIndex: 'used',
            key: 'used',
            sorter: (a, b) => a.used - b.used,
            sortOrder: sortedInfo.columnKey === 'used' && sortedInfo.order,
            ellipsis: true,
          },
          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filteredValue: filteredInfo.type || null,
            onFilter: (value, record) => record.type.includes(value),
            sorter: (a, b) => a.type.length - b.type.length,
            sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
            ellipsis: true,
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filteredValue: filteredInfo.status || null,
            onFilter: (value, record) => record.status.includes(value),
            sorter: (a, b) => {
              return a.status.length - b.status.length
            },
            sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
            ellipsis: true,
          },
        ];
        return (
          <>
            <Container>
              <form>
                <Input type='text' value={value} placeholder="Enter the status" onChange={this.inputChange}/>
                <Table pagination={false} columns={columns} dataSource={this.dataRequest()} onChange={this.handleChange}></Table>
                <Info>{valueInfo}</Info>
              </form>
            </Container>
          </>
        );
      }
    }