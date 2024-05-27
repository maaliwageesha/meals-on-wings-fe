import React, { useEffect, useState } from 'react'
// import { Header } from '../../layouts/Header/Header'
import { firestore } from '../../firebase'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import OrdersTable from '../../components/Restraunt/OrdrersTable'
import { RestaurantHome } from './RestaurantHome'

export const RestrauntOngoingOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'orders'))
      const ordersArray = []

      // Fetch customer, restaurant, and item details in parallel
      const fetchOrderDetails = querySnapshot.docs.map(async (docSnap) => {
        const orderData = docSnap.data()

        // Fetch customer details
        const customerDoc = await getDoc(doc(firestore, orderData.customer))
        const customerData = customerDoc.data()

        // Fetch restaurant details
        const restaurantDoc = await getDoc(doc(firestore, orderData.restaurant))
        const restaurantData = restaurantDoc.data()

        // Fetch items details
        const itemsData = await Promise.all(
          orderData.item_array.map(async (itemRef) => {
            const itemDoc = await getDoc(doc(firestore, itemRef.item))
            return { ...itemDoc.data(), item_quantity: itemRef.item_quantity }
          })
        )

        // Push the populated order data to ordersArray
        ordersArray.push({
          id: docSnap.id,
          ...orderData,
          customer_details: customerData,
          restaurant_details: restaurantData,
          item_array: itemsData,
        })
      })

      await Promise.all(fetchOrderDetails)
      setOrders(ordersArray)
      setLoading(false) // Set loading to false after data is fetched
    }

    fetchData()
  }, [])

  console.log(orders)


  return (
    <>
      <RestaurantHome />
      {loading ? 
        <div style={{textAlign: 'center'}}>Loading...</div> :
        <div className="container">
          <OrdersTable orders={orders} status="pending" />
        </div>
      }
    </>
  )
}

