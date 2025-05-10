
import { Table } from 'antd';
import { Link } from 'react-router-dom';



const data = [
  {
    id: 1,
    name: 'Laptop Lenovo',
    Price: 1200,
    Type: 'Laptop',
    Quantity: '5',
    key: '1',
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '2',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '3',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '4',
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '5',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '6',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '7',
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '8',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '9',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '10',
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '11',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '12',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '13',
  },

];

export default function AllProduct() {

  const delateProduct = (id) => {
    console.log(id)

  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',

    },
    {
      title: 'Img',
      dataIndex: 'Img',
      key: 'Img',
      render: (_, record) => <img style={{ width: "50px", height: "60px", borderRadius: "60%" }} src={`${record.img}`} alt='Photo' />,

    },
    {
      title: '',
      dataIndex: '',
      key: 'Update',
      render: (_, record) => <Link to={`/AddProduct/${record.id}`}>Update</Link>,
    },
    {
      title: '',
      dataIndex: '',
      key: 'Delete',
      render: (_, record) => <a onClick={() => delateProduct(record.id)}>Delete</a>,
    },
  ];



  return (<>
    <Table
      columns={columns}
      dataSource={data}
    />
  </>)

}
