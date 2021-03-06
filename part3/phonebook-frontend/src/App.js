import React, {useState, useEffect} from 'react';
import Filter from './components/Filter'
import AddNewContact from './components/AddNewContact'
import ContactList from './components/ContactList'
import Notification from './components/Notification'
import contactService from './services/contacts'


const App =() => {

  const [contactList, setContactList] = useState([])
  
  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        console.log(initialContacts)
        setContactList(initialContacts);
      });
  }, []);

  const initContact = {
    name: '',
    number: ''
  }

  const initMessage = {
    content: null,
    type: null
  }

  const [contact, setContact] = useState(initContact)
  const [filterStr, setFilterStr] = useState('')
  const [message, setMessage] = useState(initMessage)

  const showNotification =(content, type) => {
    const newMessage = {content, type};
    setMessage(newMessage);
    setTimeout(() =>
      { setMessage(initMessage) },
      5000
    );
  }

  const handleFormSubmit =(event) => {
    event.preventDefault();
    if (contactList.some((e) => e.name === contact.name)) {
      if (window.confirm(
        `${contact.name} is already added to the phonebook, ` +
        `replace the old number with a new one?`)) {
      const newContact = {...contact, 
        id:contactList.filter(e => e.name === contact.name)[0].id };
      contactService
        .updateContact(newContact)
        .then(returnedContact => {
          setContactList(contactList.map(e =>
            e.name === returnedContact.name ? returnedContact : e));
        })
        .catch(error => {
          showNotification(`${error.response.data}`, 'error');
        });
    }} else {
      contactService
        .create(contact)
        .then(returnedContact => {
           setContactList(contactList.concat(returnedContact));
           showNotification(`Added ${returnedContact.name}`, 'info');
        })
        .catch(error => {
          showNotification(`${error.response.data.error}`, 'error');
        });
    }
    setContact(initContact);
  }

  const handleDeleteContact =(contact) => {
    if (window.confirm(`Delete ${contact.name}`)) {
      contactService
        .deleteContact(contact)
        .then(setContactList(
          contactList.filter(e => e.id !== contact.id)));
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
        message={message}
      />
      <Filter 
        filterStr={filterStr}
        setFilterStr={setFilterStr}
      />
      <h2>Add a new</h2>
      <AddNewContact
        handleFormSubmit={handleFormSubmit}
        contact={contact}
        setContact={setContact}
      />
      <h2>Numbers</h2>
      <ContactList 
        contactList={contactList}
        filterStr={filterStr}
        handleDeleteContact={handleDeleteContact}
      />
    </div>
  )
}

export default App;
