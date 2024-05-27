import React, { useEffect, useState } from 'react'
// import { Header } from '../../layouts/Header/Header'
import { getDatabase, ref, onValue } from 'firebase/database'
import { firestore } from '../../firebase'
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore'
import { Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RestaurantHome } from './RestaurantHome'

export const MenuManagement = () => {
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'items'))
      const itemsArray = []
      querySnapshot.forEach((doc) => {
        itemsArray.push({ id: doc.id, ...doc.data() })
      })
      setItems(itemsArray)
    }

    fetchData()
  }, [])

  console.log(items)

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'items', id))
      setItems(items.filter((item) => item.id !== id))
      console.log('Document successfully deleted!')
    } catch (error) {
      console.error('Error deleting document: ', error)
    }
  }

  return (
    <>
      <RestaurantHome />
      <div className="container">
        <Button
          variant="dark"
          style={{ marginBottom: '2rem', color: 'black' }}
          onClick={() => navigate('/add-menu-item')}
        >
          Add Menu Items
        </Button>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {items?.map((item) => {
            return (
              <Card style={{ width: '18rem' }}>
                <Card.Img
                  variant="top"
                  src={item.item_pic}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {item.item_name}{' '}
                    <span>
                      {item.item_price} {item.currency}
                    </span>
                  </Card.Title>
                  <Card.Text>
                    Item Quantity: {item.item_quantity} <br/>
                    Item Weight: {item.item_weight} <br/>
                    Item Category: {item.category ? item.category : 'Miscellaneous'} <br/>
                    Availability: {item.availability}
                  </Card.Text>
                  {/* <Card.Text>Item Weight: {item.item_weight}</Card.Text> */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="success"
                      style={{ color: 'black' }}
                      onClick={() =>
                        navigate(`/edit-menu-item/${item.id}`, {
                          state: {
                            id: item.id,
                            item_name: item.item_name,
                            item_price: item.item_price,
                            item_quantity: item.item_quantity,
                            item_weight: item.item_weight,
                            currency: item.currency,
                            item_pic: item.item_pic,
                            category: item.category,
                            availability: item.availability,
                          },
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      style={{ color: 'black' }}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}

