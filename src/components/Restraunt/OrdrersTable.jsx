import React from 'react'
import { Table } from 'react-bootstrap'
import { firestore } from '../../firebase'
import { doc, updateDoc } from 'firebase/firestore'

const OrdersTable = ({ orders, status }) => {
  const btnStyle = {border: '1px solid black', padding: '5px', backgroundColor: '#bbb'}
  const updateStatus = async (orderId, newStatus) => {
    try {
      const docRef = doc(firestore, 'orders', orderId)
      await updateDoc(docRef, {
        order_status: newStatus
      })
      // Reload the page to reflect the change
      window.location.reload();
    } catch (e) {
      console.error('Error updating document: ', e)
    }
  }
  const getTable = ()=>{
    if (status === 'pending') {
      return (
        <>
          <h1>Pending Orders</h1>
          <Table responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Food Ordered</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Order Status</th>
                <th>Restaurant</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(
                (order) =>
                  order.order_status === 'pending' && (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        {order.item_array.map((item) => `${item.item_name}, `)}
                      </td>
                      <td>
                        {order.item_array.map((item, index) => (
                          <div key={index}>{item.item_quantity}</div>
                        ))}
                      </td>
                      <td>{order.order_date && new Date(order.order_date.seconds * 1000).toLocaleString()}</td>
                      <td>{order.order_status}</td>
                      <td>
                        {order.restaurant_details?.rest_name || 'Loading...'}
                      </td>
                      <td>{order.total_price}</td>
                      <td>
                        <button style={btnStyle} onClick={() => updateStatus(order.id, 'pickedup')}>Mark as Picked Up</button>  
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </>
      )
    }
    if (status === 'pickedup') {
      return (
        <>
          <h1>Picked UP Orders</h1>
          <Table responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Food Ordered</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Order Status</th>
                <th>Restaurant</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(
                (order) =>
                  order.order_status === 'pickedup' && (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        {order.item_array.map((item) => `${item.item_name}, `)}
                      </td>
                      <td>
                        {order.item_array.map((item, index) => (
                          <div key={index}>{item.item_quantity}</div>
                        ))}
                      </td>
                      <td>{order.order_date && new Date(order.order_date.seconds * 1000).toLocaleString()}</td>
                      <td>{order.order_status}</td>
                      <td>
                        {order.restaurant_details?.rest_name || 'Loading...'}
                      </td>
                      <td>{order.total_price}</td>
                      <td>
                        <button style={btnStyle} onClick={() => updateStatus(order.id, 'delivered')}>Mark as Delivered</button>  
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </>
      )
    }
    if (status === 'delivered') {
      return (
        <>
          <h1>Delivered Orders</h1>
          <Table responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Food Ordered</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Order Status</th>
                <th>Restaurant</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(
                (order) =>
                  order.order_status === 'delivered' && (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        {order.item_array.map((item) => `${item.item_name}, `)}
                      </td>
                      <td>
                        {order.item_array.map((item, index) => (
                          <div key={index}>{item.item_quantity}</div>
                        ))}
                      </td>
                      <td>{order.order_date && new Date(order.order_date.seconds * 1000).toLocaleString()}</td>
                      <td>{order.order_status}</td>
                      <td>
                        {order.restaurant_details?.rest_name || 'Loading...'}
                      </td>
                      <td>{order.total_price}</td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </>
      )
    }
  }

  return(
    <>{getTable()}</>
  )
}

export default OrdersTable
