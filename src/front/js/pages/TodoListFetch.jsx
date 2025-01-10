import React, { useEffect, useState } from "react";


export const TodoListFetch = () => {

  const baseURL = 'https://playground.4geeks.com/todo';

  const usuario = 'lluisespert';

  const [esEditable, setEsEditable] = useState(false);

  const [tarea, setTarea] = useState('');

  const [todos, setTodos] = useState([]);

  const [ editarTarea, setEditarTarea ] = useState({});

  const [ labelEdit, setLabelEdit ] = useState('');

  const [ completedEdit, setCompletedEdit ] = useState();


  const handleSubmitAdd = async (event) => {
    event.preventDefault();
    
    const dataToSend = {

      label: tarea,

      is_done: false

    };

    const uri = `${baseURL}/todos/${usuario}`

    const opciones = {

      method: 'POST',

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify(dataToSend)

    }
    
    const response = await fetch(uri, opciones);

    if (!response.ok) {
        
      console.log('error:', response.status, response.statusText)

      return; 
    }

    setTarea('');

    getTodos();

  }

  const handleEdit = (editarTarea) => {
    
    setEsEditable(true);

    setEditarTarea(editarTarea);

    setLabelEdit(editarTarea.label);

    setCompletedEdit(editarTarea.is_done);

  }

  
  const handleSubmitEdit = async (event) => {

    event.preventDefault();

    const dataToSend = {

      label: labelEdit,

      is_done: completedEdit

    };

    const uri = `${baseURL}/todos/${editarTarea.id}`;
    
    const opciones = {

      method: 'PUT',

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify(dataToSend)

    }
    
    const response = await fetch(uri, opciones);

    if (!response.ok) {
            
            console.log('error:', response.status, response.statusText)
            return   
    }
    
    getTodos();
    
    setEsEditable(false);

    setEsEditable({});

    setLabelEdit('');

    setCompletedEdit(null);

    
  }


  const handleDelete = async (tareaId) => {
  
    const uri = `${baseURL}/todos/${tareaId}`

    const opciones = {

      method: 'DELETE'

    }

    const response = await fetch(uri, opciones);

    if (!response.ok) {
      
      console.log('error:', response.status, response.statusText)

      return  

    }

    getTodos();

  }

  const getTodos = async () => {
    
    const uri = `${baseURL}/users/${usuario}`;
     
    const opciones = {

      method: 'GET'

    }
     
    const response = await fetch(uri, opciones);
    
    if (!response.ok) {
      
      console.log('error:', response.status, response.statusText)

      
      if (response.status == 404) {

      }

      return   
    }

    const data = await response.json();

    setTodos(data.todos);

  }

  useEffect(() => {

    getTodos()

  }, [])

  return (

    <div className="container my-5">

      <h1 className="text-success">Todo List Con Fetch</h1>
      {esEditable ?

        <form onSubmit={handleSubmitEdit}>

          <div className="text-start mb-3">

            <label htmlFor="exampleInputPassword1" className="form-label">Editar Tarea</label>

            <input type="text" className="form-control" id="exampleInputPassword1" 

              value={labelEdit} onChange={(event) => { setLabelEdit(event.target.value)}} />

          </div>

          <div className="text-start mb-3 form-check">

            <input type="checkbox" className="form-check-input" id="exampleCheck1" 

              checked={completedEdit} onChange={(event) => { setCompletedEdit(event.target.checked)}}/>

            <label className="form-check-label" htmlFor="exampleCheck1">Completada la tarea</label>

          </div>

          <button type="submit" className="btn btn-primary me-2">Enviar</button>

          <button type="reset" className="btn btn-secondary">Reset</button>

        </form>

        :

        <form onSubmit={handleSubmitAdd}>

          <div className="text-start mb-3">

            <label htmlFor="exampleTask" className="form-label">Añadir Tarea</label>

            <input type="text" className="form-control" id="exampleTask"

              value={tarea} onChange={(event) => setTarea(event.target.value)} />

          </div>

        </form>

      }

      <h2 className="text-primary mt-5">Lista de tareas</h2>

      <ul className="text-start list-group">

        {todos.map((item) => <li key={item.id}

          className="list-group-item  d-flex justify-content-between">

          <div>

            {item.is_done ?

              <i className="fa fa-thumbs-up text-success me-2"></i>

              :

              <i className="fa fa-times-circle text-danger me-2"></i>

            }

            {item.label}

          </div>

          <div>

            <span onClick={() => handleEdit(item)}>

              <i className="fa fa-check-square-o text-primary me-2"></i>

            </span>

            <span onClick={() => handleDelete(item.id)}>

              <i className="fa fa-remove text-danger"></i>

            </span>

          </div>

        </li>)}


        <li className="list-group-item text-end">{todos.length == 0 ? 'No hay tareas, añade nuevas tareas' : todos.length + ' tasks'}</li>

      </ul>

    </div>

  )

}