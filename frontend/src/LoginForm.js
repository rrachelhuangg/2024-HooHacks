import React from "react"


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.visible = true
        this.name = "Enter Username"
    }

    handleChange(event) {
        this.setState({name: event.target.value})
    }

    handleSubmit(event) {
        this.visible = false
    }

    render() {
        return(
        <form className = "loginPage" onSubmit={this.handleSubmit} visible={this.visible}>
          <div><label>Enter username:</label></div>
            <input 
              type="text" 
              value={this.name}
              onChange={(e) => this.handleChange(e)}
            />
          <div><input className = "inputField" type="submit" /></div>
        </form>);
    }

}

export default LoginForm;