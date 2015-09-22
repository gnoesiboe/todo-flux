# todo-flux
javascript flux todo app application

## Installation

1. Get dependencies:

  ```bash
  npm install
  ```

2. Run js builder:

   ```bash
   npm start
   ```
   (detects changes to javascript files and when one occurs, packages them in one `app.js` javascript file in the `build/js` folder)

3. Open `index.html` in your browser (you might need to start a http server)

## Setup

### Stores

* Represent access to the data layer. If stores todo's (Model in MVC) and you can use it to retrieve them. 
* The store implements the observer pattern. This enables **Components** to listen to the store for change events, so that, when one occurs, the view can retrieve the new data and re-render. 
* The store itself listens to **Actions** that are dispatched by the **Dispatcher** and handles them if appropriate.

### Action

* Are plain javascript objects that represent actions that are initiated by users of by the system, and need to be handled. (Like a command in CommandHandler pattern). They always have a `type` key, but might also contain other information, ie:

  ```javascript
  {
    type: 'TODO_CHANGE_POSITION',
    id: 1,
    newIndex: 3,
    newCollection: 'today'
  }
  ```

* The types are stored as constants in the `ActionConstants` module. 
* The actions can be created using the `ActionFactory` module.

### Dispatcher

* The application has one dispatcher (as should always be the case within an application), the `AppDispatcher`. 
* The dispatcher is the traffic controller for any actions that occur (ie. `TodoCreate`, `TodoDelete`, `TodoComplete`). 
* Actions can be dispatched from **Components** and other modules (like **Stores** and **Components**) can register themselves as listeners to these actions. 
* The dispatcher makes sure that only one action is handled at the time, to prevent hard to spot errors and event loops. If you dispatch an action in the middle of another action, an `Error` is thrown. 
* The dispatcher broadcasts the action to all listeners. You can not listen to specific actions.

### Components

* Represent the views (and sometimes Controller) in MVC. I used React components, but could also be backbone components.
* works like a tree of components. The `TodoAppComponent` is the root component that is rendered in it's container (`#js-app-container`). This component itself includes other components that are renderd within the parent's dom elements. ie:
  
  1. `TodoAppComponent`  
  1.1 `AddTodoComponent`  
  1.2 `TodayComponent`  
  1.2.1 `TodoListComponent`

  etc.

* You have dumb components and active components. Dumb components only display information, active components also contain state and/or logic (and acts like a controller).
* Some of theses components retrieve data from the stores and listen to changes to re-render themselves (and with it their child components) when a change in the store's data occurs.
* Some components dispatch **Actions** with the **Dispatcher** ie. on user input changes

### Collection

I use a `TodoCollection` to ease access to a collection of todo's. It contains utility functions for searching and filtering a collection, among other utility functions.


## Further reading material

* [Flux application architecture](https://facebook.github.io/flux/docs/overview.html)
* [React](https://facebook.github.io/react/)
