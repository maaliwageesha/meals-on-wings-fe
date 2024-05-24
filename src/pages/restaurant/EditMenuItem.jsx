import React, { useEffect, useState } from 'react'
import { Header } from '../../layouts/Header/Header'
import { Form, Button } from 'react-bootstrap'
import { firestore } from '../../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'

const EditMenuItem = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const item = location.state

  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemWeight, setItemWeight] = useState('')
  const [currency, setCurrency] = useState('')
  const [itemPicture, setItemPicture] = useState('')

  useEffect(() => {
    if (item) {
      setItemName(item.item_name)
      setItemPrice(item.item_price)
      setItemQuantity(item.item_quantity)
      setItemWeight(item.item_weight)
      setCurrency(item.currency)
      setItemPicture(item.item_pic)
    }
  }, [item])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !itemName ||
      !itemPrice ||
      !itemQuantity ||
      !itemWeight ||
      !currency ||
      !itemPicture
    ) {
      alert('Please fill in all fields')
      return
    }

    try {
      const docRef = doc(firestore, 'items', item.id)
      await updateDoc(docRef, {
        item_name: itemName,
        item_price: itemPrice,
        item_quantity: itemQuantity,
        item_weight: itemWeight,
        currency: currency,
        item_pic: itemPicture,
      })
      console.log('Document updated with ID: ', item.id)
      navigate('/menu-management')
    } catch (e) {
      console.error('Error updating document: ', e)
    }
  }

  return (
    <>
      <Header />
      <div className="container" style={{ width: '60%' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formItemName">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemPrice">
            <Form.Label>Item Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Item price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemQuantity">
            <Form.Label>Item Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Item quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemWeight">
            <Form.Label>Item Weight</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Item weight"
              value={itemWeight}
              onChange={(e) => setItemWeight(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCurrency">
            <Form.Label>Currency</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formItemPicture">
            <Form.Label>Item Picture</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item picture URL"
              value={itemPicture}
              onChange={(e) => setItemPicture(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  )
}

export default EditMenuItem
