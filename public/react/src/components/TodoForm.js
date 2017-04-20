import React, { Component } from 'react';

class TodoForm extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            body : '',
            working : false
        };
    }

    handleInputChange(e)
    {
        this.setState({body:e.target.value})
        if(e.keyCode == 13)
        {
            alert('123');
        }
    }
    
    handleClick()
    {
        if(this.state.body.trim() == '') return 
        this.setState({working:true});

        let self = this
        let myHeaders = new Headers({
            "X-CSRF-TOKEN": _token
        });

        let data = new FormData();
        data.append('body',self.state.body);

        //Save info the text
        fetch(API_URL +'/todos/store', {
           method : 'post',
           credentials: "same-origin",
           headers: myHeaders,
           body : data 
        }).then((response)=> 
        {
            response.json().then((jsonReponse)=> 
            {
                if(jsonReponse.success)
                {                                        
                    self.props.onTodoStore(jsonReponse.todo)                    
                    self.setState({body:''});
                    self.setState({working:false});                    
                }
            })
        });    
    }

    render() {
        let loading = this.state.working ? 'loading' :  ''
        return (
            <div>
                <div className="ui action input fluid">
                    <input type="text" 
                        placeholder="Add new ..." 
                        value={this.state.body}
                        onChange={this.handleInputChange.bind(this)}
                    />    
                    <button onClick={this.handleClick.bind(this)} className={`ui button blue ${loading}`}>
                        <i className="plus icon"></i>Create
                    </button>
                </div>                
            </div>
        );
    }
}

export default TodoForm;