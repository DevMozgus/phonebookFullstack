import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import service from './service'
//getAll add update

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ newSearch, setNewSearch ] = useState('')

    const handleSearchChange = (event) => {
        setNewSearch(event.target.value)
    }

    useEffect(() => {
      service.getAll()
        .then(response => {
          setPersons(response)
        })
    }, [])


    return (
      <div>
        <h2>Search</h2>
        <input value={newSearch}
        onChange={handleSearchChange}
        />
        <PersonForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        />
        <h2>Numbers</h2>
        <Persons persons={persons} 
        setPersons={setPersons}
        newSearch={newSearch}
        />
      </div>
    )
}




export default App
