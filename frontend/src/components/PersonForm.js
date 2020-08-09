import React, { useState } from 'react'
import service from '../service'
//getAll update add

const PersonForm = (props) => {
    const persons = props.persons
    const setPersons = props.setPersons
    const newName = props.newName
    const setNewName = props.setNewName
    const newNumber = props.newNumber
    const setNewNumber = props.setNewNumber
    const [error, setError ] = useState(null)


    const nameExists = (input) => {
        const match = persons.filter( person => {
            if (person.name === input)
                return person
        })
        return match
    }

    const addPerson = (personObject) => {

        service.add(personObject)
            .then(response => {
                setPersons(persons.concat(response))
            })
            .catch(err => {
                setError(JSON.stringify(err.response.data))
                console.log(err)
                setTimeout(() => { 
                    setError(null)
                }, 5000)
            })
        
        setNewName('')
        setNewNumber('')
    }

    const updatePerson = (id, personObject) => {
        service.update(id, personObject)
            .then(response => {
                setPersons(persons.map(person => person.id !== id ? person : response
                ))
            })
            .catch(err => {
                setError(JSON.stringify(err.response.data))
                setTimeout(() => { 
                    setError(null)
                }, 5000)
            })
        setNewName('')
        setNewNumber('')
    }

    const handleNewPerson = (event) => {

        event.preventDefault()

        const personObject = {
            name: newName,
            number: newNumber
        }

        let [ match ]  = nameExists(newName)
        match = (!match ? '' : match)

        if(match.number === newNumber) {
            alert(`${newName} already added`)
        } 
        else if (match.name === newName 
        && match.number !== newNumber ) {
            if (window.confirm(`${newName} already exists. Replace the old number?`)) 
                updatePerson(match.id, personObject)
        } 
        else {
            addPerson(personObject)
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <>  
        <Notification message={error} />
        <h2>Add Person</h2>
        <form onSubmit={handleNewPerson} >
          <div>
            name: <input value={newName} 
            onChange={handleNameChange}
            />
          </div>
          <div>
            number: <input value={newNumber} 
            onChange={handleNumberChange}
            />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
        </>
    )
}

const Notification = ({ message }) => {
    if (message === null) 
        return null

    return (
        <div className="error" >
            {message}
        </div>
    )
}

export default PersonForm