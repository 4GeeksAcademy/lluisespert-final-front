const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [{title: "FIRST", background: "white", initial: "white"},
				     {title: "SECOND", background: "white", initial: "white"}],
			cohorte: 'Spain 91',
			isLogged: false,
			users: [],
			user: { name: ''},
			todos: [],
			baseURLTodo: 'https://playground.4geeks.com/todo',
			starships: [],
			favorites: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setUser: (currentUser) => { setStore({ user: currentUser }) },
			clearTodos: () => { setStore ({ todos: [] })},
			addFavorites: (item) => {
				setStore({ favorites: [...getStore().favorites, item]})
			},
			removeFavorites: (item) => {
				setStore({ favorites: getStore().favorites.filter((favorite) => favorite != item)})
			},
			getUsers: async () => {
				const uri = `${getStore().baseURLTodo}/users`
				const response = await fetch(uri)
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					/* Tratar el error 404 que significa q el user no existe, por lo tanto debo crearlo con un POST */
					return   // IMPORTANTE ---- ME VOY
				}
				const data = await response.json();
				setStore({ users: data.users })
			},
			getTodos: async () => {
				const uri = `${getStore().baseURLTodo}/users/${getStore().user.name}`;
				const options = {
					method: 'GET'
				}
				console.log(uri)
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					/* Tratar el error 404 que significa q el user no existe, por lo tanto debo crearlo con un POST */
					if (response.status == 404) {
		
					}
					return   // IMPORTANTE ---- ME VOY
				}
				const data = await response.json();
				// setTodos(data.todos);
				setStore( { todos: data.todos })
			},
			addTodo: async (dataToSend) => {
				const uri = `${getStore().baseURLTodo}/todos/${getStore().user.name}`
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					// tratamos el error
					console.log('error:', response.status, response.statusText)
					return   // IMPORTANTE ---- ME VOY
				}
				// const data = await response.json();
				// console.log(data);
				// 6. toda la lógica de mi función 
				getActions().getTodos();
			},
			updateTodo: async (dataToSend, id) => {
				const uri = `${getStore().baseURLTodo}/todos/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
								// tratamos el error
								console.log('error:', response.status, response.statusText)
								return   // IMPORTANTE ---- ME VOY
				}
				getActions().getTodos();
			},
			deleteTodo: async (taskId) => {
				const uri = `${getStore().baseURLTodo}/todos/${taskId}`
				const options = {
					method: 'DELETE'
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					// 4.1 trato el error
					console.log('error:', response.status, response.statusText)
					return   // IMPORTANTE ---- ME VOY
				}
				getActions().getTodos();
			},
			exampleFunction: () => {getActions().changeColor(0, "green");},
			getMessage: async () => {
				const response = await fetch(process.env.BACKEND_URL + "/api/hello")
				if (!response.ok) {
					console.log("Error loading message from backend", response.status, response.statusText);
					return;
				}
				const data = await response.json()
				setStore({ message: data.message })
				// don't forget to return something, that is how the async resolves
				return data;
			},
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				// We have to loop the entire demo array to look for the respective index and change its color
				const demo = store.demo.map((element, i) => {
					if (i === index) {
						element.background = color
					};
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
			},
			getStarships: async () => {
				const uri = 'https://www.swapi.tech/api/starships/';
				const response = await fetch(uri);
				if (!response.ok) {
					// trato el error
					console.log('Error: ', response.status, response.statusText);
					return
				}
				const data = await response.json();
				console.log(data);
				console.log(data.results)
				setStore({ starships: data.results })
				localStorage.setItem('localStarships', JSON.stringify(data.results))
			}
		}
	};
};


export default getState;