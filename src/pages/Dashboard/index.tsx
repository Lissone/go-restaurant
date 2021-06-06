import { useEffect, useState } from 'react'

import api from '../../services/api'
import { Header } from '../../components/Header'
import { Food as FoodComponent } from '../../components/Food'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'

import { FoodsContainer } from './styles'

interface Food {
  id: number
  name: string
  description: string
  price: number
  available: boolean
  image: string 
}

export function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([])
  const [editingFood, setEditingFood] = useState<Food>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods')

      setFoods(response.data)
    }

    getFoods()
  }, [])

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: Food) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood, ...food 
      })

      const foodsUpdated = foods.map(food => food.id !== foodUpdated.data.id ? food : foodUpdated.data)

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)

    setFoods(foodsFiltered)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: Food) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <FoodComponent
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
