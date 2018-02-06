import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Item from './components/Item';
import Footer from './components/Footer';

import './common/style/index.css';
import './common/style/base.css';

// import todosData from './common/data/todosData';

class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            inputVal: '',
            todosData: [],
            view: 'all',

        };

        this.inputChange = this.inputChange.bind(this);
        this.inputOnEnter = this.inputOnEnter.bind(this);
        this.todoOnChange = this.todoOnChange.bind(this);
        this.deleteToto = this.deleteToto.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.changeView = this.changeView.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
    }
    inputChange(ev){

        let {value} = ev.target;

        this.setState({
            inputVal: ev.target.value
        });
    }


    inputOnEnter(ev){
        if(ev.keyCode!==13) return;

        let {value} = ev.target;
        let {todosData} = this.state;

        if( !value.trim() )return;

        this.setState({
            todosData: [
                ...todosData,
                {
                    id: Math.random(),
                    content: value,
                    isActive: true
                }
            ],
            inputVal: ''
        });
    }

  
    todoOnChange(id){
        let {todosData} = this.state;

        let newTodos = todosData.map( (todo, indx)=>{
            if(todo.id === id){
                todo.isActive = !todo.isActive;
            }
            return todo;
        } );

        this.setState({
            todosData: newTodos
        })

    }


    deleteToto(id){
        let {todosData} = this.state;
    
        let newTodos = todosData.filter( (todo, indx)=>{
            return todo.id === id ? false : true
        } );

        this.setState({
            todosData: newTodos
        })
    }

    toggleAll(ev){
        let {checked} = ev.target;
        let {todosData} = this.state;

        this.setState({
            todosData: todosData.map(elt =>{
                elt.isActive = !checked;
                return elt;
            })
        })
    }

    
    changeView(view){
        this.setState({
            view
        })
    }

 
    clearCompleted(){
        let {todosData} = this.state;
        let newTodos = todosData.filter( (todo, indx)=>{
            return todo.isActive ? true : false
        } );

        this.setState({
            todosData: newTodos
        })
    }

    render(){
        let {inputVal, todosData, view} = this.state;
        let {
            inputChange,
            inputOnEnter,
            todoOnChange,
            deleteToto,
            toggleAll,
            changeView,
            clearCompleted
        } = this;

      
        let todosLength = todosData.length;

        let leftCount =todosLength;

      
        let filteredTodosData = todosData.filter( (elt, indx, arr)=>{
            let {id, content, isActive} = elt;

            let shouldStay = false;

            if(!isActive) leftCount--;

            switch (view) {
                case 'active':
                    if(isActive===true){
                        shouldStay = true;
                    }
                    break;
                case 'completed':
                    if(isActive===false){
                        shouldStay = true;
                    }
                    break;
                default:
                    shouldStay = true;
            }

            return shouldStay;
        } );

        let todosComponent = filteredTodosData.map( ({id,isActive, content})=> {
            return  (
                <Item
                    key={id}
                    { ...{
                        id,
                        content,
                        isActive,
                        todoOnChange,
                        deleteToto
                    } }
                />
            );
        } )

        return (
            <div>
                <header className="header">
                    <h1>todos</h1>
                    <input
                        className="new-todo"
                        placeholder="What needs to be done?"
                        autoFocus={true}
                        value={inputVal}
                        onChange={inputChange}
                        onKeyDown={inputOnEnter}
                    />
                </header>

                {todosLength>0 ? (
                    <section className="main">
                        <input
                            className="toggle-all"
                            type="checkbox"
                            onChange={toggleAll}
                            checked={ leftCount===0 }
                        />
                        <ul className="todo-list">
                            {todosComponent}
                        </ul>
                    </section>
                ) : null}

                { todosLength>0 ? (
                    <Footer
                        {...{
                            changeView,
                            view,
                            leftCount,
                            clearCompleted: clearCompleted,
                            showClearButton: todosLength > leftCount
                        }}
                    />
                ) : null}

            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
